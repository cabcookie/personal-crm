import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { EditorJsonContent, initialNotesJson, transformNotesVersion } from "@/components/ui-elements/notes-writer/NotesWriter";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes: EditorJsonContent;
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

type ActivityData = SelectionSet<Schema["Activity"]["type"], typeof selectionSet>;

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
      notesJson: notes,
    });
    if (errors) handleApiErrors(errors, "Error updating activity notes");
    mutateActivity(updated);
    return data?.id;
  };

  const addProjectToActivity = async (
    projectId: string,
    activityId: string
  ) => {
    if (!activityId) return;
    if (activity?.projectIds.includes(projectId)) return;
    const updated: Activity = {
      id: activityId,
      notes: initialNotesJson,
      finishedOn: new Date(),
      projectIds: [...(activity?.projectIds || []), projectId],
      updatedAt: new Date(),
    };
    mutateActivity(updated, false);
    const { errors } = await client.models.ProjectActivity.create({
      activityId: activityId,
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
    updateDate,
  };
};

export default useActivity;
