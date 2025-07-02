import { subWeeks, isAfter } from "date-fns";
import { Project } from "@/api/ContextProjects";
import { ILeanActivity } from "@/components/activities/activity-lean";

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
export const aggregateProjectNotes = (
  project: Project,
  allActivities?: ILeanActivity[]
): string => {
  if (!allActivities) {
    // Use activities from the project itself if no external activities provided
    const relevantActivities = filterActivitiesWithinSixWeeks(
      project.activities
    );
    return relevantActivities
      .map(
        (activity) =>
          `Activity ${activity.id} (${activity.finishedOn.toLocaleDateString()})`
      )
      .join("\n\n");
  }

  // Filter activities that are related to this project and within 6 weeks
  const projectActivities = allActivities.filter(
    (activity) =>
      activity.projectIds.includes(project.id) &&
      isAfter(activity.finishedOn, getDateWindows().sixWeeksAgo)
  );

  return projectActivities
    .map(
      (activity) =>
        `Activity ${activity.id} (${activity.finishedOn.toLocaleDateString()})`
    )
    .join("\n\n");
};

/**
 * Transforms review data for historical comparison
 */
export interface ReviewEntry {
  id: string;
  projectId: string;
  category: StorableReviewCategory;
  content: string;
  createdAt: Date;
}

/**
 * Groups historical review entries by project and category for duplicate detection
 */
export const groupHistoricalEntries = (
  entries: ReviewEntry[]
): Record<string, Record<string, ReviewEntry[]>> => {
  return entries.reduce(
    (acc, entry) => {
      const projectKey = entry.projectId;
      const categoryKey = entry.category;

      if (!acc[projectKey]) {
        acc[projectKey] = {};
      }
      if (!acc[projectKey][categoryKey]) {
        acc[projectKey][categoryKey] = [];
      }

      acc[projectKey][categoryKey].push(entry);
      return acc;
    },
    {} as Record<string, Record<string, ReviewEntry[]>>
  );
};

/**
 * Formats historical entries for AI duplicate detection analysis
 */
export const formatHistoricalEntriesForAI = (
  projectId: string,
  category: StorableReviewCategory,
  historicalEntries: ReviewEntry[]
): string => {
  const relevantEntries = historicalEntries.filter(
    (entry) =>
      entry.projectId === projectId &&
      entry.category === category &&
      isAfter(entry.createdAt, getDateWindows().fourWeeksAgo)
  );

  if (relevantEntries.length === 0) {
    return "No historical entries found for this project and category.";
  }

  return relevantEntries
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(
      (entry) =>
        `Date: ${entry.createdAt.toLocaleDateString()}\nContent: ${entry.content}`
    )
    .join("\n\n---\n\n");
};

/**
 * Generates time window description for AI context
 */
export const getTimeWindowDescription = (): string => {
  const { now, sixWeeksAgo } = getDateWindows();
  return `6-week analysis window: ${sixWeeksAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`;
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
export const REVIEW_CATEGORIES = {
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
export const isValidReviewCategory = (
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
