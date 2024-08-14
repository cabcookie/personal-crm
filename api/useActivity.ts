import { type Schema } from "@/amplify/data/resource";
import {
  getBlockFromId,
  getBlocks,
  getMentionedPeopleFromBlock,
  getMentionedPeopleFromBlocks,
  stringifyBlock,
} from "@/components/ui-elements/editors/helpers/document";
import { transformNotesVersion } from "@/components/ui-elements/editors/helpers/transformers";
import { EditorJsonContent } from "@/components/ui-elements/notes-writer/useExtensions";
import { useToast } from "@/components/ui/use-toast";
import { newDateString, toISODateTimeString } from "@/helpers/functional";
import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { isEqual } from "lodash";
import { compact, find, flatten, flow, get, map, union } from "lodash/fp";
import useSWR from "swr";
import { GraphQLFormattedError, handleApiErrors } from "./globals";
const client = generateClient<Schema>();

let tranformingActivityIds: string[] = [];

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

const getMentionedPeopleIds = (
  content: EditorJsonContent["content"]
): string[] =>
  flow(
    (c) => c as EditorJsonContent["content"],
    map((c) =>
      c.type === "mention" ? c.attrs?.id : getMentionedPeopleIds(c.content)
    ),
    flatten
  )(content);

const getExistingMentionedPeopleIds = (
  blockId: string,
  blocks: NoteBlockData[]
) => flow(getBlockFromId(blocks), getMentionedPeopleFromBlock)(blockId);

const removePeopleLinkIfNeeded =
  (blocks: NoteBlockData[], blockId: string, block: EditorJsonContent) =>
  async (personId: string) => {
    const existingPeopleIds = getMentionedPeopleIds(block.content);
    if (existingPeopleIds.includes(personId)) return;
    const personLinkToDelete = flow(
      getBlockFromId(blocks),
      get("people"),
      find((p) => p.personId === personId),
      get("id")
    )(blockId);
    if (!personLinkToDelete) return;
    const { data, errors } = await client.models.NoteBlockPerson.delete({
      id: personLinkToDelete,
    });
    if (errors) handleApiErrors(errors, "Deleting block/person link failed");
    return data?.id;
  };

const createPeopleLinkIfNeeded =
  (activity: ActivityData, blockId: string) => async (personId: string) => {
    const existingPeopleIds = getExistingMentionedPeopleIds(
      blockId,
      activity.noteBlocks
    );
    if (existingPeopleIds.includes(personId)) return;
    const { data, errors } = await client.models.NoteBlockPerson.create({
      noteBlockId: blockId,
      personId,
    });
    if (errors) handleApiErrors(errors, "Creating block/person link failed");
    return data?.id;
  };

const linkMentionedPeople = async (
  activity: ActivityData,
  blockId: string,
  block: EditorJsonContent
) => {
  const createdLinksIds = await Promise.all(
    flow(
      getMentionedPeopleIds,
      map(createPeopleLinkIfNeeded(activity, blockId))
    )(block.content)
  );
  const removedLinksIds = await Promise.all(
    flow(
      getExistingMentionedPeopleIds,
      map(removePeopleLinkIfNeeded(activity.noteBlocks, blockId, block))
    )(blockId, activity.noteBlocks)
  );

  return {
    createdLinkIds: createdLinksIds.filter((id) => !!id),
    removedLinkIds: removedLinksIds.filter((id) => !!id),
  };
};

const createNoteBlockLinkedToTodo = async (
  activity: ActivityData,
  todoId: string,
  block: EditorJsonContent
) => {
  const { data, errors } = await client.models.NoteBlock.create({
    activityId: activity.id,
    formatVersion: 3,
    todoId,
    type: "taskItem",
  });
  if (errors) {
    handleApiErrors(errors, "Updating Note to v3 failed (with linked todo)");
    throw errors;
  }
  if (!data) return;
  const result = await linkMentionedPeople(activity, data.id, block);
  console.log("linking mentioned people", result);
  return data.id;
};

const createTodoAndNoteBlock = async (
  activity: ActivityData,
  block: EditorJsonContent
) => {
  const checked = (block.attrs?.checked ?? false) as boolean;
  const { data, errors } = await client.models.Todo.create({
    todo: stringifyBlock(block),
    status: checked ? "DONE" : "OPEN",
    doneOn: checked ? newDateString() : null,
    projectIds: flow(
      get("forProjects"),
      map(get("projectsId"), compact)
    )(activity),
  });
  if (errors) {
    handleApiErrors(errors, "Creating Todo failed");
    throw errors;
  }
  if (!data) {
    const error: GraphQLFormattedError = {
      message: "Creating Todo didn't retrieve resulting data",
      errorType: "No data retrieved",
      errorInfo: null,
    };
    handleApiErrors([error], "Creating Todo failed; no data");
    throw error;
  }
  return createNoteBlockLinkedToTodo(activity, data.id, block);
};

const createNoteBlock = async (
  activity: ActivityData,
  block: EditorJsonContent
) => {
  const { data, errors } = await client.models.NoteBlock.create({
    activityId: activity.id,
    formatVersion: 3,
    content: stringifyBlock(block),
    type: block.type ?? "paragraph",
  });
  if (errors) {
    handleApiErrors(errors, "Updating Note to v3 failed");
    throw errors;
  }
  if (!data) return;
  const result = await linkMentionedPeople(activity, data.id, block);
  console.log("linking mentioned people", result);
  return data.id;
};

const createBlock =
  (activity: ActivityData) => async (block: EditorJsonContent) => {
    if (block.type === "taskItem")
      return createTodoAndNoteBlock(activity, block);
    return createNoteBlock(activity, block);
  };

const updateBlockIds = async (
  activity: ActivityData,
  blockIds: (string | undefined)[]
) => {
  const { data, errors } = await client.models.Activity.update({
    id: activity.id,
    noteBlockIds: blockIds.map((id) => id ?? ""),
    formatVersion: 3,
    notes: null,
    notesJson: null,
  });
  if (errors) {
    handleApiErrors(errors, "Updating activity block ids failed");
    throw errors;
  }
  return data;
};

const updateActivityToNotesVersion3 = async (activity: ActivityData) => {
  tranformingActivityIds = flow(union([activity.id]))(tranformingActivityIds);
  const blocks = flow(transformNotesVersion, getBlocks)(activity);
  if (!blocks) return mapActivity(activity);
  const resultIds = await Promise.all(blocks.map(createBlock(activity)));
  const result = await updateBlockIds(activity, resultIds);
  if (!result) return;
  const data = await fetchActivity(activity.id)();
  if (!data) return;
  tranformingActivityIds = tranformingActivityIds.filter(
    (id) => id !== data.id
  );
  return data;
};

const fetchActivity =
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
