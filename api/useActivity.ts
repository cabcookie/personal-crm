import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes: string;
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds: string[];
};

const selectionSet = [
  "id",
  "notes",
  "meetingActivitiesId",
  "finishedOn",
  "createdAt",
  "updatedAt",
  "forProjects.projectsId",
] as const;

type ActivityData = SelectionSet<Schema["Activity"], typeof selectionSet>;

export const mapActivity: (activity: ActivityData) => Activity = ({
  id,
  notes,
  meetingActivitiesId,
  finishedOn,
  createdAt,
  updatedAt,
  forProjects,
}) => ({
  id,
  notes: notes || "",
  meetingId: meetingActivitiesId || undefined,
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
  projectIds: forProjects.map(({ projectsId }) => projectsId),
});

const fetchActivity = (activityId?: string) => async () => {
  if (!activityId) return;
  const { data, errors } = await client.models.Activity.get(
    { id: activityId },
    { selectionSet }
  );
  if (errors) throw errors;
  return mapActivity(data);
};

const useActivity = (activityId?: string) => {
  const {
    data: activity,
    error: errorActivity,
    isLoading: loadingActivity,
    mutate: mutateActivity,
  } = useSWR(`/api/activities/${activityId}`, fetchActivity(activityId));

  const updateNotes = async (notes: string) => {
    if (!activity?.id) return;
    const updated: Activity = { ...activity, notes, updatedAt: new Date() };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error updating activity notes");
    mutateActivity(updated);
    return data.id;
  };

  const addProjectToActivity = async (
    projectId: string,
    newActivityId?: string
  ) => {
    if (!activity && !newActivityId) return;
    if (!activity?.projectIds.includes(projectId)) return;
    const updated: Activity = {
      ...activity,
      id: newActivityId || activity.id,
      projectIds: [...(activity?.projectIds || []), projectId],
    };
    mutateActivity(updated, false);
    const { errors } = await client.models.ProjectActivity.create({
      activityId: newActivityId || activity.id,
      projectsId: projectId,
    });
    if (errors)
      handleApiErrors(errors, "Error adding a project to an activitiy");
    mutateActivity(updated);
  };

  return {
    activity,
    loadingActivity,
    errorActivity,
    updateNotes,
    addProjectToActivity,
  };
};

export default useActivity;
