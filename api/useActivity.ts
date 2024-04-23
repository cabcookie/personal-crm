import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes: string;
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
};

export const mapActivity: (activity: Schema["Activity"]) => Activity = ({
  id,
  notes,
  meetingActivitiesId,
  finishedOn,
  createdAt,
  updatedAt,
}) => ({
  id,
  notes: notes || "",
  meetingId: meetingActivitiesId || undefined,
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
});

const fetchActivity = (activityId?: string) => async () => {
  if (!activityId) return;
  const { data, errors } = await client.models.Activity.get({ id: activityId });
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

  return {
    activity,
    loadingActivity,
    errorActivity,
    updateNotes,
  };
};

export default useActivity;
