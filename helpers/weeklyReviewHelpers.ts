import { subWeeks, isAfter, format, startOfWeek, formatISO } from "date-fns";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Dispatch, SetStateAction } from "react";
import { SelectionSet } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import {
  compact,
  filter,
  flow,
  identity,
  join,
  map,
  sortBy,
  get,
  size,
} from "lodash/fp";
import { uniqueId } from "lodash";
import { handleApiErrors } from "@/api/globals";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";
import { getMarkdown } from "@/components/ui-elements/editors/helpers/text-generation";
import {
  useWeeklyReview,
  WeeklyReview,
  WeeklyReviewEntry,
} from "@/api/useWeeklyReview";
import { client } from "@/lib/amplify";
import { useAccountsContext } from "@/api/ContextAccounts";

export const startProcessing = async ({
  setIsProcessing,
  setProcessingStatus,
  setProjectNotes,
  projects,
  existingReviewsForReview,
  weeksToReview = 1,
  accounts,
}: StartProcessingProps) => {
  if (!projects) return;
  if (!accounts) return;
  setProjectNotes([]);
  setIsProcessing(true);
  setProcessingStatus("Identifying relevant projects...");

  try {
    const relevantProjects = flow(
      identity<typeof projects>,
      filter(hasAccounts),
      filter(isOpenOrDoneRecently(weeksToReview)),
      filter(hasRecentActivity(weeksToReview)),
      filter(hasNoExistingReview(existingReviewsForReview))
    )(projects);

    setProcessingStatus(`Found ${relevantProjects.length} projects to analyze`);

    const processedProjects: ProjectForReview[] = [];

    for (let i = 0; i < relevantProjects.length; i++) {
      const project = relevantProjects[i];
      setProcessingStatus(
        `Analyzing ${i + 1}/${relevantProjects.length}: "${project.project}"`
      );

      const projectNotes = await aggregateProjectNotes(project, weeksToReview);

      // Only include projects with sufficient notes (> 400 characters)
      if (projectNotes.length > 400) {
        const processedProject = {
          id: uniqueId(),
          projectId: project.id,
          accountNames: flow(
            identity<typeof accounts>,
            filter((a) => project.accountIds.includes(a.id)),
            map((a) => a.name)
          )(accounts),
          name: project.project,
          notes: projectNotes,
          category: undefined,
        } as ProjectForReview;

        processedProjects.push(processedProject);
        setProjectNotes((old) => [...old, processedProject]);
      }
    }

    if (processedProjects.length === 0) {
      setProcessingStatus("No projects with sufficient notes found.");
    } else {
      setProcessingStatus(
        `Found ${processedProjects.length} projects ready for analysis.`
      );
    }
  } catch (error) {
    console.error("Error during processing:", error);
    setProcessingStatus("Processing failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

interface StartProcessingProps {
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setProcessingStatus: Dispatch<SetStateAction<string>>;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  projects: ReturnType<typeof useProjectsContext>["projects"];
  existingReviewsForReview: ReturnType<typeof useWeeklyReview>["weeklyReviews"];
  weeksToReview?: number;
  accounts: ReturnType<typeof useAccountsContext>["accounts"];
}

/**
 * Checks if a project has any associated accounts
 * @param project The project to check for associated accounts
 * @returns boolean indicating if the project has any associated accounts
 */
const hasAccounts = (project: Project) => project.accountIds.length > 0;

/**
 * Filters projects to include:
 * - All currently open projects (done: false)
 * - Projects closed within the selected timeframe
 */
const isOpenOrDoneRecently =
  (weeksToReview: number = 1) =>
  (project: Project): boolean => {
    if (!project.done) return true;
    if (!project.doneOn) return false;
    // Check if the project was done within the selected review period
    return isAfter(project.doneOn, weeksAgo(weeksToReview));
  };

/**
 * Aggregates activity notes for a specific project within the selected timeframe
 */
const aggregateProjectNotes = async (
  project: Project,
  weeksToReview: number = 1
): Promise<string> => {
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId(
      { projectsId: project.id },
      {
        limit: 1000,
        selectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Loading project notes failed");
    throw errors;
  }

  return flow(
    identity<NotesData[] | undefined>,
    map("activity"),
    compact,
    map(mapNotes),
    filter((note: { date: Date; content: string }) =>
      justLastWeeks(note, weeksToReview)
    ),
    sortBy<{ date: Date; content: string }>((note) => -note.date),
    map("content"),
    join("\n")
  )(data);
};

/**
 * Validates if a project has activity within the selected timeframe
 */
const hasRecentActivity =
  (weeksToReview: number = 1) =>
  (project: Project): boolean =>
    project.activities.some((a) =>
      isAfter(a.finishedOn, weeksAgo(weeksToReview))
    );

export const validProject = (p: ProjectForReview) =>
  !p.wbrText && p.category !== "none";

export const getCategory = async (project: ProjectForReview) => {
  const { data, errors } = await client.generations.categorizeProject({
    projectName: project.name,
    notes: project.notes,
  });
  if (errors) {
    handleApiErrors(errors, "Project categorization failed");
    throw errors;
  }
  return data;
};

export const getWeeklyNarrative = async (
  project: ProjectForReview
): Promise<ProjectForReview | undefined> => {
  if (!project.category || project.category === "none") return;
  const { data, errors } = await client.generations.generateWeeklyNarrative({
    projectName: project.name,
    accountNames: project.accountNames,
    notes: project.notes,
    category: project.category,
  });
  if (errors) {
    handleApiErrors(errors, "Weekly narrative generation failed");
    throw errors;
  }
  return { ...project, id: uniqueId(), wbrText: data ?? undefined };
};

export const improveWeeklyNarrative = async (
  project: WeeklyReviewEntry,
  userFeedback: string
): Promise<string | undefined> => {
  if (!project.category || project.category === "none" || !project.content)
    return;
  const { data, errors } = await client.generations.updateNarrative({
    category: project.category,
    existingNarrative: project.content,
    userFeedback: userFeedback,
  });
  if (errors) {
    handleApiErrors(errors, "Weekly narrative improvement failed");
    throw errors;
  }
  return data ?? undefined;
};

const selectionSet = [
  "activity.createdAt",
  "activity.finishedOn",
  "activity.formatVersion",
  "activity.forMeeting.topic",
  "activity.forMeeting.meetingOn",
  "activity.noteBlocks.formatVersion",
  "activity.noteBlocks.id",
  "activity.noteBlocks.content",
  "activity.noteBlocks.type",
  "activity.noteBlocks.todo.id",
  "activity.noteBlocks.todo.todo",
  "activity.noteBlocks.todo.status",
  "activity.noteBlocks.todo.doneOn",
  "activity.noteBlocks.people.id",
  "activity.noteBlocks.people.personId",
  "activity.noteBlockIds",
  "activity.notes",
  "activity.notesJson",
] as const;

type NotesData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;

/**
 * Date calculation utilities for weekly review functionality
 */
const weeksAgo = (weeks: number) => subWeeks(new Date(), weeks);

const justLastWeeks = (
  { date }: { date: Date; content: string },
  weeks: number
): boolean => date >= weeksAgo(weeks);

const mapNotes = ({
  createdAt,
  finishedOn,
  forMeeting,
  formatVersion,
  noteBlocks,
  noteBlockIds,
  notes,
  notesJson,
}: NotesData["activity"]) => {
  const noteDoc = createDocument({
    formatVersion,
    notes,
    notesJson,
    noteBlockIds,
    noteBlocks,
  });
  const noteDate = new Date(forMeeting?.meetingOn || finishedOn || createdAt);
  return {
    date: noteDate,
    content: `## ${format(noteDate, "yyyy-MM-dd")} – ${forMeeting ? `Meeting: ${forMeeting.topic}` : "Project Notes"}\n\n${getMarkdown(noteDoc)}\n`,
  };
};

export type ProjectForReview = {
  id: string;
  projectId: string;
  accountNames: string[];
  name: string;
  notes: string;
  category?: WeeklyReviewEntry["category"];
  wbrText?: string;
};

const hasNoExistingReview =
  (existing: StartProcessingProps["existingReviewsForReview"]) =>
  (project: Project) =>
    !existing?.some((e) => e.entries.some((r) => r.projectId === project.id));

export const getWeekStart = () => startOfWeek(new Date(), { weekStartsOn: 1 });

export const isSameStartOfWeek = ({ date }: WeeklyReview) =>
  formatISO(date, { representation: "date" }) ===
  formatISO(getWeekStart(), { representation: "date" });

export const getValidEntries = flow(
  identity<WeeklyReview>,
  get("entries"),
  filter(({ category }) => category !== "none")
);

export const getEntryCount = flow(
  identity<WeeklyReview>,
  getValidEntries,
  size
);

export const getIgnoredEntries = flow(
  identity<WeeklyReview>,
  get("entries"),
  filter(({ category }) => category === "none")
);

export const getIgnoredEntryCount = flow(
  identity<WeeklyReview>,
  getIgnoredEntries,
  size
);

/**
 * Checks if there are projects available for review this week
 */
export const hasProjectsToReview = (
  projects: ReturnType<typeof useProjectsContext>["projects"],
  existingReviewsForReview: ReturnType<typeof useWeeklyReview>["weeklyReviews"],
  weeksToReview: number = 1
): boolean => {
  if (!projects) return false;

  const relevantProjects = flow(
    identity<typeof projects>,
    filter(isOpenOrDoneRecently(weeksToReview)),
    filter(hasRecentActivity(weeksToReview)),
    filter(hasNoExistingReview(existingReviewsForReview))
  )(projects);

  return relevantProjects.length > 0;
};
