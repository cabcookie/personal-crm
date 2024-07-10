import { type Schema } from "@/amplify/data/resource";
import { useToast } from "@/components/ui/use-toast";
import {
  EditorJsonContent,
  transformNotesVersion,
} from "@/helpers/ui-notes-writer";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes?: EditorJsonContent | string;
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds: string[];
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
    version: formatVersion,
    notes,
    notesJson,
  }),
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
  if (!data) throw new Error("fetchActivity didn't retrieve data");
  return mapActivity(data);
};

const useActivity = (activityId?: string) => {
  const {
    data: activity,
    error: errorActivity,
    isLoading: loadingActivity,
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

  const updateNotes = async (notes: EditorJsonContent) => {
    if (!activity?.id) return;
    const updated: Activity = { ...activity, notes, updatedAt: new Date() };
    mutateActivity(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      notes: null,
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

  return {
    activity,
    loadingActivity,
    errorActivity,
    updateNotes,
    updateDate,
    addProjectToActivity,
  };
};

export default useActivity;
