import { type Schema } from "@/amplify/data/resource";
import { getMentionedPeopleFromBlocks } from "@/components/ui-elements/editors/helpers/people-mentioned";
import {
  tranformingActivityIds,
  updateActivityToNotesVersion3,
} from "@/components/ui-elements/editors/helpers/transform-v3";
import { transformNotesVersion } from "@/components/ui-elements/editors/helpers/transformers";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { useToast } from "@/components/ui/use-toast";
import { toISODateTimeString } from "@/helpers/functional";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { isEqual } from "lodash";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Activity = {
  id: string;
  notes: EditorJsonContent;
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
  projectIds: string[];
  projectActivityIds: string[];
  noteBlockIds: (string | null)[] | null;
  mentionedPeopleIds: string[];
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
  "noteBlockIds",
  "noteBlocks.id",
  "noteBlocks.content",
  "noteBlocks.type",
  "noteBlocks.formatVersion",
  "noteBlocks.todo.id",
  "noteBlocks.todo.todo",
  "noteBlocks.todo.status",
  "noteBlocks.todo.doneOn",
  "noteBlocks.todo.projectIds",
  "noteBlocks.people.id",
  "noteBlocks.people.personId",
] as const;

export type ActivityData = SelectionSet<
  Schema["Activity"]["type"],
  typeof selectionSet
>;
export type NoteBlockData = ActivityData["noteBlocks"][number];

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
  noteBlockIds,
  noteBlocks,
}) => ({
  id,
  notes: transformNotesVersion({
    formatVersion,
    notes,
    notesJson,
    noteBlockIds,
    noteBlocks,
  }),
  noteBlockIds,
  meetingId: meetingActivitiesId || undefined,
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
  projectIds: forProjects.map(({ projectsId }) => projectsId),
  projectActivityIds: forProjects.map(({ id }) => id),
  mentionedPeopleIds: getMentionedPeopleFromBlocks({
    noteBlocks,
    noteBlockIds,
  }),
});

export const fetchActivity =
  (activityId?: string) => async (): Promise<Activity | undefined> => {
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
    if (
      (!data.formatVersion || data.formatVersion < 3) &&
      !tranformingActivityIds.includes(data.id)
    )
      return updateActivityToNotesVersion3(data);
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
      finishedOn: toISODateTimeString(date),
    });
    if (errors) handleApiErrors(errors, "Error updating date of activity");

    mutateActivity(updated);
    return data?.id;
  };

  const updateNotes = async ({ json: notes }: SerializerOutput) => {
    if (!activity?.id) return;
    if (isEqual(activity.notes, notes)) return;
    const updated: Activity = {
      ...activity,
      notes,
      updatedAt: new Date(),
    };
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
