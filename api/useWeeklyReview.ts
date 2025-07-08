import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { flow, identity, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { formatISO } from "date-fns";
import { ProjectForReview } from "@/helpers/weeklyReviewHelpers";
import { uniqueId } from "lodash";
const client = generateClient<Schema>();

export const useWeeklyReview = () => {
  const {
    isLoading,
    data: weeklyReviews,
    error: errorLoading,
    mutate: mutateWeeklyReviews,
  } = useSWR("/api/weekly-reviews", fetchWeeklyReviews);

  const updateWeeklyReviewEntryContent = async (
    entryId: string,
    content: string
  ) => {
    const updated = weeklyReviews?.map((r) => ({
      ...r,
      entries: r.entries.map((e) =>
        e.id !== entryId
          ? e
          : {
              ...e,
              isEdited: true,
              content,
            }
      ),
    }));
    if (updated) mutateWeeklyReviews(updated, false);

    const { data, errors } = await client.models.WeeklyReviewEntry.update({
      id: entryId,
      content,
      isEdited: true,
    });
    if (errors)
      handleApiErrors(errors, "Failed to update weekly business review entry");
    if (updated) mutateWeeklyReviews(updated);

    return data;
  };

  const createWeeklyReviewEntry =
    (reviewId: string) =>
    async ({
      projectId,
      content,
      generatedContent,
      category,
    }: WeeklyReviewEntry) => {
      const { data, errors } = await client.models.WeeklyReviewEntry.create({
        category,
        projectId,
        content,
        generatedContent,
        reviewId,
      });

      if (errors)
        handleApiErrors(
          errors,
          `Failed creating entry for project ${projectId} with category ${category}`
        );

      return data;
    };

  const createWeeklyReview = async (projects: ProjectForReview[]) => {
    const weeklyReview: WeeklyReview = {
      id: uniqueId(),
      date: new Date(),
      createdAt: new Date(),
      status: "draft",
      entries: projects.map(projectToWeeklyReviewEntry),
    };
    const updated = [...(weeklyReviews ?? []), weeklyReview];
    mutateWeeklyReviews(updated, false);

    const { data, errors } = await client.models.WeeklyReview.create({
      date: formatISO(weeklyReview.date, { representation: "date" }),
      createdAt: formatISO(weeklyReview.createdAt),
      status: weeklyReview.status,
    });

    if (errors) handleApiErrors(errors, "Failed creating weekly review");

    const entries =
      errors || !data
        ? []
        : await Promise.all(
            weeklyReview.entries.map(createWeeklyReviewEntry(data.id))
          );

    mutateWeeklyReviews(updated);
    console.log("FINISHED CREATING", { ...data, entries });
  };

  return {
    weeklyReviews,
    mutateWeeklyReviews,
    isLoading,
    errorLoading,
    createWeeklyReview,
    updateWeeklyReviewEntryContent,
  };
};

const selectionSet = [
  "id",
  "date",
  "status",
  "createdAt",
  "entries.id",
  "entries.projectId",
  "entries.category",
  "entries.content",
  "entries.generatedContent",
  "entries.isEdited",
] as const;
type WeeklyReviewData = SelectionSet<
  Schema["WeeklyReview"]["type"],
  typeof selectionSet
>;

export type WeeklyReviewEntry = {
  id: string;
  projectId: string;
  category: WeeklyReviewData["entries"][number]["category"];
  content: string;
  generatedContent: string;
  isEdited: boolean;
};

export type WeeklyReview = {
  id: string;
  date: Date;
  status: WeeklyReviewData["status"];
  createdAt: Date;
  entries: WeeklyReviewEntry[];
};

const mapWeeklyReviewEntry = ({
  id,
  projectId,
  category,
  content,
  generatedContent,
  isEdited,
}: WeeklyReviewData["entries"][number]): WeeklyReviewEntry => ({
  id,
  projectId,
  category,
  content: content ?? "",
  generatedContent: generatedContent ?? "",
  isEdited: !!isEdited,
});

const mapWeeklyReview = ({
  id,
  date,
  createdAt,
  entries,
  status,
}: WeeklyReviewData): WeeklyReview => ({
  id,
  status,
  date: new Date(date),
  createdAt: new Date(createdAt),
  entries: entries.map(mapWeeklyReviewEntry),
});

const fetchWeeklyReviews = async () => {
  const { data, errors } = await client.models.WeeklyReview.list({
    limit: 100,
    selectionSet,
  });

  if (errors) {
    handleApiErrors(errors, "Error loading weekly reviews");
    throw errors;
  }

  return flow(
    identity<WeeklyReviewData[] | null>,
    map(mapWeeklyReview),
    sortBy((r) => -r.createdAt),
    sortBy((r) => -r.date)
  )(data);
};

const projectToWeeklyReviewEntry = ({
  id: projectId,
  name: project,
  category,
  wbrText: content,
}: ProjectForReview): WeeklyReviewEntry => {
  if (!category) throw `No category defined for project "${project}"`;
  if (!content)
    throw `No narrative defined for project "${project}" and category ${category}`;

  return {
    id: uniqueId(),
    projectId,
    category: category as WeeklyReviewData["entries"][number]["category"],
    content,
    generatedContent: content,
    isEdited: false,
  };
};
