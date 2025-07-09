import { subWeeks, isAfter, format, startOfWeek, formatISO } from "date-fns";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Dispatch, SetStateAction } from "react";
import { generateClient, SelectionSet } from "aws-amplify/data";
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
import { handleApiErrors } from "@/api/globals";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { useWeeklyReview, WeeklyReview } from "@/api/useWeeklyReview";
const client = generateClient<Schema>();

export const startProcessing = async ({
  setIsProcessing,
  setProcessingStatus,
  setProjectNotes,
  projects,
  existingReviewsForReview,
}: StartProcessingProps) => {
  if (!projects) return;
  setProjectNotes([]);
  setIsProcessing(true);
  setProcessingStatus("Identifying relevant projects...");

  try {
    const relevantProjects = flow(
      filter(isOpenOrDoneRecently),
      filter(hasRecentActivity),
      filter(hasNoExistingReview(existingReviewsForReview))
    )(projects);

    const maxProjectCount = Math.min(relevantProjects.length, 10);
    setProcessingStatus(`Found ${maxProjectCount} projects to analyze`);

    for (let i = 0; i < maxProjectCount; i++) {
      const project = relevantProjects[i];
      setProcessingStatus(
        `Analyzing ${i + 1}/${maxProjectCount}: "${project.project}"`
      );

      const projectNotes = await aggregateProjectNotes(project);
      setProjectNotes((old) => [
        ...old,
        {
          id: project.id,
          name: project.project,
          notes: projectNotes,
          category: projectNotes.length < 900 ? "none" : undefined,
        },
      ]);
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
}

/**
 * Filters projects to include:
 * - All currently open projects (done: false)
 * - Projects closed within the last 2 weeks (doneOn within 2 weeks)
 */
const isOpenOrDoneRecently = (project: Project): boolean => {
  if (!project.done) return true;
  if (!project.doneOn) return false;
  return isAfter(project.doneOn, weeksAgo(2));
};

/**
 * Aggregates activity notes for a specific project within the 6-week window
 */
const aggregateProjectNotes = async (project: Project): Promise<string> => {
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
    filter(justLastSixWeeks),
    sortBy<{ date: Date; content: string }>((note) => -note.date),
    map("content"),
    join("\n")
  )(data);
};

/**
 * Validates if a project has sufficient activity data for analysis
 */
const hasRecentActivity = (project: Project): boolean =>
  project.activities.some((a) => isAfter(a.finishedOn, weeksAgo(6)));

export const hasMissingCategories = (projectNotes: ProjectForReview[]) =>
  projectNotes.some((p) => !p.category);

export const validProject = (p: ProjectForReview) =>
  !p.wbrText && p.category !== "none";

export const hasMissingNarratives = (projectNotes: ProjectForReview[]) =>
  projectNotes.some(validProject);

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

const justLastSixWeeks = ({ date }: { date: Date; content: string }): boolean =>
  date >= weeksAgo(6);

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
    content: `## ${format(noteDate, "yyyy-MM-dd")} – ${forMeeting ? `Meeting: ${forMeeting.topic}` : "Project Notes"}\n\n${getTextFromJsonContent(noteDoc)}\n`,
  };
};

export type ProjectForReview = {
  id: string;
  name: string;
  notes: string;
  category?: Schema["WeeklyReviewEntry"]["type"]["category"];
  wbrText?: string;
};

const hasNoExistingReview =
  (existing: StartProcessingProps["existingReviewsForReview"]) =>
  (project: Project) =>
    !existing?.some((e) => e.entries.some((r) => r.projectId === project.id));

export const hasNoCategory = ({ category }: ProjectForReview) => !category;

export const isValidCategory = ({ category }: ProjectForReview) =>
  category !== "none";

export const isNoneCategory = ({ category }: ProjectForReview) =>
  category === "none";

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
