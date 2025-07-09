import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { find, flow, get, identity, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { formatISO } from "date-fns";
import {
  getWeekStart,
  isSameStartOfWeek,
  ProjectForReview,
} from "@/helpers/weeklyReviewHelpers";
import { uniqueId } from "lodash";
const client = generateClient<Schema>();

export const useWeeklyReview = (date?: Date) => {
  const {
    isLoading,
    data: weeklyReviews,
    error: errorLoading,
    mutate: mutateWeeklyReviews,
  } = useSWR("/api/weekly-reviews", fetchWeeklyReviews(date));

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

  const updateWeeklyReviewEntryCategory = async (
    entryId: string,
    category: WeeklyReviewData["entries"][number]["category"]
  ) => {
    const updated = weeklyReviews?.map((r) => ({
      ...r,
      entries: r.entries.map((e) =>
        e.id !== entryId
          ? e
          : {
              ...e,
              category,
            }
      ),
    }));
    if (updated) mutateWeeklyReviews(updated, false);

    const { data, errors } = await client.models.WeeklyReviewEntry.update({
      id: entryId,
      category,
    });
    if (errors)
      handleApiErrors(
        errors,
        "Failed to update weekly business review entry category"
      );
    if (updated) mutateWeeklyReviews(updated);

    return data;
  };

  const deleteWeeklyReviewEntry = async (entryId: string) => {
    const updated = weeklyReviews?.map((r) => ({
      ...r,
      entries: r.entries.filter((e) => e.id !== entryId),
    }));
    if (updated) mutateWeeklyReviews(updated, false);

    const { data, errors } = await client.models.WeeklyReviewEntry.delete({
      id: entryId,
    });
    if (errors)
      handleApiErrors(errors, "Failed to delete weekly business review entry");
    if (updated) mutateWeeklyReviews(updated);

    return data;
  };

  const updateWeeklyReviewStatus = async (
    reviewId: string,
    status: WeeklyReviewData["status"]
  ) => {
    const updated = weeklyReviews?.map((r) =>
      r.id !== reviewId ? r : { ...r, status }
    );
    if (updated) mutateWeeklyReviews(updated, false);

    const { data, errors } = await client.models.WeeklyReview.update({
      id: reviewId,
      status,
    });
    if (errors)
      handleApiErrors(errors, "Failed to update weekly review status");
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

  const getWeeklyReviewAndCreateEntries = async (
    projects: ProjectForReview[]
  ) => {
    if (!weeklyReviews) return;
    const reviewId = flow(
      identity<typeof weeklyReviews>,
      find(isSameStartOfWeek),
      get("id")
    )(weeklyReviews);
    if (!reviewId) return;

    const newEntries = projects.map(projectToWeeklyReviewEntry);
    const updated = weeklyReviews.map((w) =>
      w.id !== reviewId
        ? w
        : {
            ...w,
            entries: [...w.entries, ...newEntries],
          }
    );
    if (updated) mutateWeeklyReviews(updated, false);

    await Promise.all(newEntries.map(createWeeklyReviewEntry(reviewId)));
    if (updated) mutateWeeklyReviews(updated, false);
  };

  const createWeeklyReview = async (projects: ProjectForReview[]) => {
    if (weeklyReviews?.some(isSameStartOfWeek))
      return getWeeklyReviewAndCreateEntries(projects);

    const weeklyReview: WeeklyReview = {
      id: uniqueId(),
      date: getWeekStart(),
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

    if (data)
      await Promise.all(
        weeklyReview.entries.map(createWeeklyReviewEntry(data.id))
      );

    mutateWeeklyReviews(updated);
  };

  return {
    weeklyReviews,
    mutateWeeklyReviews,
    isLoading,
    errorLoading,
    createWeeklyReview,
    updateWeeklyReviewEntryContent,
    updateWeeklyReviewEntryCategory,
    deleteWeeklyReviewEntry,
    updateWeeklyReviewStatus,
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

const formatWbrData = flow(
  identity<WeeklyReviewData[] | null>,
  map(mapWeeklyReview),
  sortBy((r) => -r.createdAt),
  sortBy((r) => -r.date)
);

const getDataByWeekStart = async (date: Date) => {
  const { data, errors } = await client.models.WeeklyReview.listWbrByWeek(
    { date: formatISO(date, { representation: "date" }) },
    { sortDirection: "DESC", selectionSet }
  );

  if (errors) {
    handleApiErrors(errors, "Error loading weekly reviews (by date)");
    throw errors;
  }

  return formatWbrData(data);
};

const getReviews = async () => {
  const { data, errors } = await client.models.WeeklyReview.list({
    limit: 100,
    selectionSet,
  });

  if (errors) {
    handleApiErrors(errors, "Error loading weekly reviews");
    throw errors;
  }

  return formatWbrData(data);
};

const fetchWeeklyReviews = (date?: Date) => () =>
  !date ? getReviews() : getDataByWeekStart(date);

const projectToWeeklyReviewEntry = ({
  projectId,
  name: project,
  category,
  wbrText: content,
}: ProjectForReview): WeeklyReviewEntry => {
  if (!category) throw `No category defined for project "${project}"`;
  if (!content && category !== "none")
    throw `No narrative defined for project "${project}" and category ${category}`;

  return {
    id: uniqueId(),
    projectId,
    category,
    content: content ?? "",
    generatedContent: content ?? "",
    isEdited: false,
  };
};
