import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR, { KeyedMutator } from "swr";
import { useProjectsContext, Project } from "./ContextProjects";
import { toast } from "@/components/ui/use-toast";
import { handleApiErrors } from "./globals";
import {
  filterRelevantProjects,
  aggregateProjectNotes,
  getTimeWindowDescription,
  hasRecentActivity,
  formatHistoricalEntriesForAI,
  ReviewEntry,
  REVIEW_CATEGORIES,
  StorableReviewCategory,
  isValidReviewCategory,
} from "@/helpers/weeklyReviewHelpers";
import { useState } from "react";

const client = generateClient<Schema>();

interface WeeklyReviewContextType {
  // Data fetching
  reviews: WeeklyReview[] | undefined;
  loadingReviews: boolean;
  errorReviews: any;

  // Project analysis
  getRelevantProjects: () => Project[];

  // AI processing pipeline
  categorizeProject: (project: Project) => Promise<{
    category: StorableReviewCategory;
    justification: string;
  } | null>;

  generateReviewContent: (
    project: Project,
    category: StorableReviewCategory
  ) => Promise<{ content: string } | null>;

  checkForDuplicates: (
    project: Project,
    category: StorableReviewCategory,
    newContent: string
  ) => Promise<{ decision: "include" | "exclude"; reasoning: string } | null>;

  // Review management
  createReview: (date: Date) => Promise<WeeklyReview | undefined>;
  saveReviewEntry: (
    reviewId: string,
    projectId: string,
    category: StorableReviewCategory,
    content: string,
    generatedContent?: string
  ) => Promise<WeeklyReviewEntry | undefined>;

  deleteReviewEntry: (entryId: string) => Promise<boolean>;

  updateReviewStatus: (
    reviewId: string,
    status: "draft" | "in_progress" | "completed"
  ) => Promise<boolean>;

  // Historical data
  getHistoricalEntries: (
    projectId: string,
    category: StorableReviewCategory
  ) => Promise<ReviewEntry[]>;

  mutateReviews: KeyedMutator<WeeklyReview[]>;
}

export interface WeeklyReview {
  id: string;
  date: Date;
  status: "draft" | "in_progress" | "completed";
  title?: string;
  description?: string;
  entries: WeeklyReviewEntry[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface WeeklyReviewEntry {
  id: string;
  reviewId: string;
  projectId: string;
  project?: Project;
  category: StorableReviewCategory;
  content: any; // JSON content for rich text
  generatedContent?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Selection set for fetching weekly reviews
const reviewSelectionSet = [
  "id",
  "date",
  "status",
  "title",
  "description",
  "createdAt",
  "entries.id",
  "entries.projectId",
  "entries.category",
  "entries.content",
  "entries.generatedContent",
  "entries.isEdited",
  "entries.createdAt",
] as const;

const mapWeeklyReview = (data: any): WeeklyReview => ({
  id: data.id,
  date: new Date(data.date),
  status: data.status,
  title: data.title,
  description: data.description,
  entries: (data.entries || []).map((entry: any) => ({
    id: entry.id,
    reviewId: data.id,
    projectId: entry.projectId,
    category: entry.category,
    content: entry.content,
    generatedContent: entry.generatedContent,
    isEdited: entry.isEdited || false,
    createdAt: new Date(entry.createdAt),
    updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
  })),
  createdAt: new Date(data.createdAt),
  updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
});

const fetchWeeklyReviews = async (): Promise<WeeklyReview[]> => {
  const { data, errors } = await client.models.WeeklyReview.list({
    limit: 100,
    selectionSet: reviewSelectionSet,
  });

  if (errors) {
    handleApiErrors(errors, "Error loading weekly reviews");
    throw errors;
  }

  return data
    .map(mapWeeklyReview)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const useWeeklyReview = (): WeeklyReviewContextType => {
  const { projects } = useProjectsContext();
  const [_processingState, setProcessingState] = useState<{
    currentProject?: string;
    currentPhase?:
      | "categorization"
      | "content_generation"
      | "duplicate_detection";
  }>({});

  const {
    data: reviews,
    error: errorReviews,
    isLoading: loadingReviews,
    mutate: mutateReviews,
  } = useSWR("/api/weekly-reviews", fetchWeeklyReviews);

  const getRelevantProjects = (): Project[] => {
    if (!projects) return [];
    return filterRelevantProjects(projects).filter(hasRecentActivity);
  };

  const categorizeProject = async (
    project: Project
  ): Promise<{
    category: StorableReviewCategory;
    justification: string;
  } | null> => {
    try {
      setProcessingState({
        currentProject: project.id,
        currentPhase: "categorization",
      });

      const projectNotes = aggregateProjectNotes(project);
      const timeWindow = getTimeWindowDescription();

      const { data, errors } = await client.generations.projectCategorization({
        projectName: project.project,
        projectNotes,
        timeWindow,
      });

      if (errors) {
        handleApiErrors(
          errors,
          `Error categorizing project ${project.project}`
        );
        return null;
      }

      if (
        !data?.category ||
        !data?.justification ||
        !isValidReviewCategory(data.category)
      ) {
        console.warn(
          `Invalid category returned for project ${project.project}:`,
          data?.category
        );
        return null;
      }

      // Filter out "none" category - we don't store these
      if (data.category === REVIEW_CATEGORIES.NONE) {
        return null;
      }

      // At this point, we know it's a valid storable category
      return {
        category: data.category as StorableReviewCategory,
        justification: data.justification,
      };
    } catch (error) {
      console.error("Error in categorizeProject:", error);
      toast({
        title: "Categorization Error",
        description: `Failed to categorize project ${project.project}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setProcessingState({});
    }
  };

  const generateReviewContent = async (
    project: Project,
    category: StorableReviewCategory
  ): Promise<{ content: string } | null> => {
    try {
      setProcessingState({
        currentProject: project.id,
        currentPhase: "content_generation",
      });

      const projectNotes = aggregateProjectNotes(project);
      const timeWindow = getTimeWindowDescription();

      const { data, errors } = await client.generations.reviewContentGeneration(
        {
          projectName: project.project,
          projectNotes,
          category,
          timeWindow,
        }
      );

      if (errors) {
        handleApiErrors(
          errors,
          `Error generating content for project ${project.project}`
        );
        return null;
      }

      if (!data?.content) {
        console.warn(`No content generated for project ${project.project}`);
        return null;
      }

      return { content: data.content };
    } catch (error) {
      console.error("Error in generateReviewContent:", error);
      toast({
        title: "Content Generation Error",
        description: `Failed to generate content for project ${project.project}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setProcessingState({});
    }
  };

  const getHistoricalEntries = async (
    projectId: string,
    category: StorableReviewCategory
  ): Promise<ReviewEntry[]> => {
    try {
      const { data, errors } = await client.models.WeeklyReviewEntry.list({
        filter: {
          projectId: { eq: projectId },
          category: { eq: category },
        },
        limit: 50,
      });

      if (errors) {
        handleApiErrors(errors, "Error fetching historical entries");
        return [];
      }

      return data.map((entry) => ({
        id: entry.id,
        projectId: entry.projectId,
        category: entry.category as StorableReviewCategory,
        content:
          typeof entry.content === "string"
            ? entry.content
            : JSON.stringify(entry.content),
        createdAt: new Date(entry.createdAt),
      }));
    } catch (error) {
      console.error("Error fetching historical entries:", error);
      return [];
    }
  };

  const checkForDuplicates = async (
    project: Project,
    category: StorableReviewCategory,
    newContent: string
  ): Promise<{ decision: "include" | "exclude"; reasoning: string } | null> => {
    try {
      setProcessingState({
        currentProject: project.id,
        currentPhase: "duplicate_detection",
      });

      const historicalEntries = await getHistoricalEntries(
        project.id,
        category
      );
      const formattedHistory = formatHistoricalEntriesForAI(
        project.id,
        category,
        historicalEntries
      );

      const { data, errors } = await client.generations.duplicateDetection({
        newEntry: newContent,
        historicalEntries: formattedHistory,
        category,
        projectName: project.project,
      });

      if (errors) {
        handleApiErrors(
          errors,
          `Error checking duplicates for project ${project.project}`
        );
        return null;
      }

      if (!data?.decision || !data?.reasoning) {
        console.warn(
          `Invalid duplicate detection response for project ${project.project}`
        );
        return null;
      }

      const decision = data.decision.toLowerCase() as "include" | "exclude";
      if (decision !== "include" && decision !== "exclude") {
        console.warn(
          `Invalid decision from duplicate detection: ${data.decision}`
        );
        return {
          decision: "include",
          reasoning: "Unable to determine duplicate status",
        };
      }

      return {
        decision,
        reasoning: data.reasoning,
      };
    } catch (error) {
      console.error("Error in checkForDuplicates:", error);
      toast({
        title: "Duplicate Detection Error",
        description: `Failed to check duplicates for project ${project.project}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setProcessingState({});
    }
  };

  const createReview = async (
    date: Date
  ): Promise<WeeklyReview | undefined> => {
    try {
      const { data, errors } = await client.models.WeeklyReview.create({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        status: "draft",
        title: `Weekly Business Review - ${date.toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        handleApiErrors(errors, "Error creating weekly review");
        return undefined;
      }

      const newReview = mapWeeklyReview({ ...data, entries: [] });
      mutateReviews([newReview, ...(reviews || [])], false);

      toast({
        title: "Review Created",
        description: "New weekly business review created successfully",
      });

      return newReview;
    } catch (error) {
      console.error("Error creating review:", error);
      toast({
        title: "Creation Error",
        description: "Failed to create weekly review",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const saveReviewEntry = async (
    reviewId: string,
    projectId: string,
    category: StorableReviewCategory,
    content: string,
    generatedContent?: string
  ): Promise<WeeklyReviewEntry | undefined> => {
    try {
      const { data, errors } = await client.models.WeeklyReviewEntry.create({
        reviewId,
        projectId,
        category,
        content: {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: content }] },
          ],
        } as any,
        generatedContent,
        isEdited: false,
        createdAt: new Date().toISOString(),
      });

      if (errors) {
        handleApiErrors(errors, "Error saving review entry");
        return undefined;
      }

      if (!data) return undefined;

      // Update local state
      const updatedReviews = reviews?.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              entries: [
                ...review.entries,
                {
                  id: data.id,
                  reviewId,
                  projectId,
                  category,
                  content: content,
                  generatedContent,
                  isEdited: false,
                  createdAt: new Date(data.createdAt),
                },
              ],
            }
          : review
      );

      mutateReviews(updatedReviews, false);
      return data as any;
    } catch (error) {
      console.error("Error saving review entry:", error);
      toast({
        title: "Save Error",
        description: "Failed to save review entry",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const deleteReviewEntry = async (entryId: string): Promise<boolean> => {
    try {
      const { errors } = await client.models.WeeklyReviewEntry.delete({
        id: entryId,
      });

      if (errors) {
        handleApiErrors(errors, "Error deleting review entry");
        return false;
      }

      // Update local state
      const updatedReviews = reviews?.map((review) => ({
        ...review,
        entries: review.entries.filter((entry) => entry.id !== entryId),
      }));

      mutateReviews(updatedReviews, false);

      toast({
        title: "Entry Deleted",
        description: "Review entry deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error deleting review entry:", error);
      toast({
        title: "Delete Error",
        description: "Failed to delete review entry",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateReviewStatus = async (
    reviewId: string,
    status: "draft" | "in_progress" | "completed"
  ): Promise<boolean> => {
    try {
      const { errors } = await client.models.WeeklyReview.update({
        id: reviewId,
        status,
      });

      if (errors) {
        handleApiErrors(errors, "Error updating review status");
        return false;
      }

      // Update local state
      const updatedReviews = reviews?.map((review) =>
        review.id === reviewId ? { ...review, status } : review
      );

      mutateReviews(updatedReviews, false);
      return true;
    } catch (error) {
      console.error("Error updating review status:", error);
      return false;
    }
  };

  return {
    reviews,
    loadingReviews,
    errorReviews,
    getRelevantProjects,
    categorizeProject,
    generateReviewContent,
    checkForDuplicates,
    createReview,
    saveReviewEntry,
    deleteReviewEntry,
    updateReviewStatus,
    getHistoricalEntries,
    mutateReviews,
  };
};
