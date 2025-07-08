import { subWeeks, isAfter, format } from "date-fns";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { ILeanActivity } from "@/components/activities/activity-lean";
import { Dispatch, SetStateAction } from "react";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { compact, filter, flow, identity, join, map, sortBy } from "lodash/fp";
import { handleApiErrors } from "@/api/globals";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";

const client = generateClient<Schema>();

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
export const getDateWindows = () => {
  const now = new Date();
  const twoWeeksAgo = subWeeks(now, 2);
  const sixWeeksAgo = subWeeks(now, 6);
  const fourWeeksAgo = subWeeks(now, 4);

  return {
    now,
    twoWeeksAgo,
    sixWeeksAgo,
    fourWeeksAgo,
  };
};

const justLastSixWeeks = ({ date }: { date: Date; content: string }): boolean =>
  date >= getDateWindows().sixWeeksAgo;

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
  category?: string;
  wbrText?: string;
};

interface StartProcessingProps {
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setProcessingStatus: Dispatch<SetStateAction<string>>;
  setProjectNotes: Dispatch<SetStateAction<ProjectForReview[]>>;
  projects: ReturnType<typeof useProjectsContext>["projects"];
}

export const startProcessing = async ({
  setIsProcessing,
  setProcessingStatus,
  setProjectNotes,
  projects,
}: StartProcessingProps) => {
  if (!projects) return;
  setProjectNotes([]);
  setIsProcessing(true);
  setProcessingStatus("Identifying relevant projects...");

  try {
    const relevantProjects =
      filterRelevantProjects(projects).filter(hasRecentActivity);
    setProcessingStatus(`Found ${relevantProjects.length} projects to analyze`);

    for (let i = 0; i < relevantProjects.length; i++) {
      const project = relevantProjects[i];
      setProcessingStatus(
        `Analyzing ${i + 1}/${relevantProjects.length}: "${project.project}" - Phase 1: Categorization`
      );

      const projectNotes = await aggregateProjectNotes(project);
      if (projectNotes.length < 900) continue;
      setProjectNotes((old) => [
        ...old,
        { id: project.id, name: project.project, notes: projectNotes },
      ]);
    }
  } catch (error) {
    console.error("Error during processing:", error);
    setProcessingStatus("Processing failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

/**
 * Filters projects to include:
 * - All currently open projects (done: false)
 * - Projects closed within the last 2 weeks (doneOn within 2 weeks)
 */
export const filterRelevantProjects = (projects: Project[]): Project[] => {
  const { twoWeeksAgo } = getDateWindows();

  return projects.filter((project) => {
    // Include all open projects
    if (!project.done) {
      return true;
    }

    // Include recently closed projects (within 2 weeks)
    if (project.doneOn && isAfter(project.doneOn, twoWeeksAgo)) {
      return true;
    }

    return false;
  });
};

/**
 * Filters activities to include only those from the past 6 weeks
 */
export const filterActivitiesWithinSixWeeks = (
  activities: ILeanActivity[]
): ILeanActivity[] => {
  const { sixWeeksAgo } = getDateWindows();

  return activities.filter((activity) =>
    isAfter(activity.finishedOn, sixWeeksAgo)
  );
};

/**
 * Filters activities to include only those from the past 4 weeks
 * Used for duplicate detection historical comparison
 */
export const filterActivitiesWithinFourWeeks = (
  activities: ILeanActivity[]
): ILeanActivity[] => {
  const { fourWeeksAgo } = getDateWindows();

  return activities.filter((activity) =>
    isAfter(activity.finishedOn, fourWeeksAgo)
  );
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
export const hasRecentActivity = (project: Project): boolean => {
  const relevantActivities = filterActivitiesWithinSixWeeks(project.activities);
  return relevantActivities.length > 0;
};

/**
 * Categories for weekly review classification
 */
const REVIEW_CATEGORIES = {
  CUSTOMER_HIGHLIGHTS: "customer_highlights",
  CUSTOMER_LOWLIGHTS: "customer_lowlights",
  MARKET_OBSERVATIONS: "market_observations",
  GENAI_OPPORTUNITIES: "genai_opportunities",
  NONE: "none",
} as const;

export type ReviewCategory =
  (typeof REVIEW_CATEGORIES)[keyof typeof REVIEW_CATEGORIES];

// Database-storable categories (excludes "none")
export type StorableReviewCategory = Exclude<ReviewCategory, "none">;

/**
 * Type guard for review categories
 */
const isValidReviewCategory = (
  category: string
): category is ReviewCategory => {
  return Object.values(REVIEW_CATEGORIES).includes(category as ReviewCategory);
};

/**
 * Type guard for storable review categories (excludes "none")
 */
export const isStorableReviewCategory = (
  category: string
): category is StorableReviewCategory => {
  return isValidReviewCategory(category) && category !== REVIEW_CATEGORIES.NONE;
};

export const hasMissingCategories = (projectNotes: ProjectForReview[]) =>
  projectNotes.filter((p) => !p.category).length > 0;

export const hasMissingNarratives = (projectNotes: ProjectForReview[]) =>
  projectNotes.filter((p) => !p.wbrText).length > 0;
