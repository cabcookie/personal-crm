import { type Schema } from "@/amplify/data/resource";
import { useToast } from "@/components/ui/use-toast";
import {
  EditorJsonContent,
  getTasksData,
  SerializerOutput,
  transformNotesVersion,
} from "@/helpers/ui-notes-writer";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { isEqual } from "lodash";
import { flow } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes: EditorJsonContent;
  hasOpenTasks: boolean;
  openTasks?: EditorJsonContent[];
  closedTasks?: EditorJsonContent[];
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds: string[];
  projectActivityIds: string[];
};

const selectionSet = [
  "id",
  "notes",
  "formatVersion",
  "notesJson",
  "meetingActivitiesId",
  "finishedOn",
  "createdAt",
  "updatedAt",
  "forProjects.id",
  "forProjects.projectsId",
] as const;

type ActivityData = SelectionSet<
  Schema["Activity"]["type"],
  typeof selectionSet
>;

export const mapActivity: (activity: ActivityData) => Activity = ({
  id,
  notes,
  formatVersion,
  notesJson,
  meetingActivitiesId,
  finishedOn,
  createdAt,
  updatedAt,
  forProjects,
}) => ({
  id,
  notes: transformNotesVersion({
    formatVersion,
    notes,
    notesJson,
  }),
  ...flow(
    transformNotesVersion,
    getTasksData
  )({ formatVersion, notes, notesJson }),
  meetingId: meetingActivitiesId || undefined,
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
  projectIds: forProjects.map(({ projectsId }) => projectsId),
  projectActivityIds: forProjects.map(({ id }) => id),
});

const fetchActivity = (activityId?: string) => async () => {
  if (!activityId) return;
  const { data, errors } = await client.models.Activity.get(
    { id: activityId },
    { selectionSet }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading activity");
    throw errors;
  }
  if (!data) throw new Error("fetchActivity didn't retrieve data");
  try {
    return mapActivity(data);
  } catch (error) {
    console.error("fetchActivity", { error });
    throw error;
  }
};

const useActivity = (activityId?: string) => {
  const {
    data: activity,
    error: errorActivity,
    isLoading: isLoadingActivity,
    mutate: mutateActivity,
  } = useSWR(`/api/activities/${activityId}`, fetchActivity(activityId));
  const { toast } = useToast();

  const updateDate = async (date: Date) => {
    if (!activity) return;
    const updated: Activity = {
      ...activity,
      finishedOn: date,
      updatedAt: new Date(),
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      finishedOn: date.toISOString(),
    });
    if (errors) handleApiErrors(errors, "Error updating date of activity");

    mutateActivity(updated);
    return data?.id;
  };

  const updateNotes = async ({
    json: notes,
    closedTasks,
    hasOpenTasks,
    openTasks,
  }: SerializerOutput) => {
    if (!activity?.id) return;
    if (isEqual(activity.notes, notes)) return;
    const updated: Activity = {
      ...activity,
      notes,
      hasOpenTasks,
      closedTasks,
      openTasks,
      updatedAt: new Date(),
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      notes: null,
      hasOpenTasks: hasOpenTasks ? "true" : "false",
      formatVersion: 2,
      notesJson: JSON.stringify(notes),
    });
    if (errors) handleApiErrors(errors, "Error updating activity notes");
    mutateActivity(updated);
    return data?.id;
  };

  const addProjectToActivity = async (projectId: string | null) => {
    if (!activity) return;
    if (!projectId) return;
    const updated: Activity = {
      ...activity,
      projectIds: [...activity.projectIds, projectId],
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors) handleApiErrors(errors, "Error adding project to current note");
    if (data) toast({ title: "Added note to another project" });
    mutateActivity(updated);
    return data?.id;
  };

  const deleteProjectActivity = async (projectActivityId: string) => {
    if (!activity) return;
    const updated: Activity = {
      ...activity,
      projectActivityIds: activity.projectActivityIds.filter(
        (id) => id !== projectActivityId
      ),
    };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.ProjectActivity.delete({
      id: projectActivityId,
    });
    if (errors) handleApiErrors(errors, "Deleting notes on project failed");
    mutateActivity(updated);
    if (!data) return;
    toast({ title: "Deleted project notes" });
    return data.id;
  };

  return {
    activity,
    isLoadingActivity,
    errorActivity,
    updateNotes,
    updateDate,
    addProjectToActivity,
    deleteProjectActivity,
  };
};

export default useActivity;
