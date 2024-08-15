import { type Schema } from "@/amplify/data/resource";
import {
  createBlock,
  getBlockCreationSet,
  mapBlockIds,
  updateBlockIds,
  updateTempBlockIds,
} from "@/components/ui-elements/editors/helpers/blocks";
import {
  BlockMentionedPeople,
  getMentionedPeopleFromBlocks,
} from "@/components/ui-elements/editors/helpers/people-mentioned";
import {
  tranformingActivityIds,
  updateActivityToNotesVersion3,
} from "@/components/ui-elements/editors/helpers/transform-v3";
import { transformNotesVersion } from "@/components/ui-elements/editors/helpers/transformers";
import {
  BlockIdMapping,
  CreateBlockFunction,
  UpdateNotesFunction,
} from "@/components/ui-elements/editors/helpers/update-notes";
import { EditorJsonContent } from "@/components/ui-elements/editors/notes-editor/useExtensions";
import { useToast } from "@/components/ui/use-toast";
import { toISODateTimeString } from "@/helpers/functional";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { isEqual } from "lodash";
import { flow, map } from "lodash/fp";
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
  mentionedPeople: BlockMentionedPeople[];
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
  mentionedPeople: getMentionedPeopleFromBlocks(noteBlocks, noteBlockIds),
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

  const createNoteBlock: CreateBlockFunction = async (block) => {
    if (!activity) return block;
    const blockId = await createBlock(
      activity.id,
      activity.mentionedPeople,
      activity.projectIds
    )(block.content);
    return { ...block, blockId };
  };

  const createBlockWhenNeeded =
    (createBlockFn: CreateBlockFunction) => async (mapping: BlockIdMapping) => {
      if (mapping.blockId) return mapping;
      if (!mapping.content) return mapping;
      return await createBlockFn(mapping);
    };

  const updateActivityBlockIdsWhenNeeded =
    (activity: Activity) => async (blockIds: (string | undefined)[]) => {
      if (isEqual(blockIds, activity.noteBlockIds)) return;
      return await updateBlockIds(activity.id, blockIds);
    };

  const mutateActivityIfNeeded =
    (content: EditorJsonContent) =>
    async (
      newActivityPromise: Promise<Schema["Activity"]["type"] | undefined | null>
    ) => {
      if (!activity) return;
      const newActivity = await newActivityPromise;
      if (!newActivity) return;
      mutateActivity(
        {
          ...activity,
          notes: content,
          noteBlockIds: newActivity.noteBlockIds ?? [],
        },
        false
      );
    };

  const updateNotes: UpdateNotesFunction = async (editor) => {
    if (!editor) return;
    if (!activity) return;
    const creationResult: BlockIdMapping[] = await Promise.all(
      flow(
        getBlockCreationSet,
        map(createBlockWhenNeeded(createNoteBlock))
      )(editor)
    );

    await flow(
      updateTempBlockIds(editor),
      mapBlockIds,
      updateActivityBlockIdsWhenNeeded(activity),
      mutateActivityIfNeeded(editor.getJSON())
    )(creationResult);
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
