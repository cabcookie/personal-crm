import { type Schema } from "@/amplify/data/resource";
import {
  LIST_TYPES,
  stringifyBlock,
} from "@/components/ui-elements/editors/helpers/blocks";
import {
  getPeopleMentioned,
  getPersonId,
} from "@/components/ui-elements/editors/helpers/mentioned-people-cud";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { useToast } from "@/components/ui/use-toast";
import { newDateString, toISODateTimeString } from "@/helpers/functional";
import { Editor, JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/data";
import { compact } from "lodash";
import { flow, map } from "lodash/fp";
import { handleApiErrors } from "./globals";
import { HandleMutationFn, Inbox, InboxStatus, mapInbox } from "./useInbox";
const client = generateClient<Schema>();

export const createInboxItemApi = async (note: JSONContent) => {
  const { data, errors } = await client.models.Inbox.create({
    noteJson: JSON.stringify(note),
    note: null,
    formatVersion: 2,
    status: "new",
  });
  if (errors) handleApiErrors(errors, "Error creating inbox item");
  return data;
};

const useInboxWorkflow = (mutate: HandleMutationFn) => {
  const { toast } = useToast();

  const createInboxItem = async (editor: Editor) => {
    const note = editor.getJSON();
    const data = await createInboxItemApi(note);
    if (!data) return;
    toast({
      title: "New Inbox Item Created",
      description: getTextFromJsonContent(note),
    });
    mutate({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "new",
      note,
    });
    return data.id;
  };

  const updateNote =
    (inboxItem: Inbox) => async (id: string, editor: Editor) => {
      const note = editor.getJSON();
      const updated: Inbox = {
        ...inboxItem,
        note,
      };
      mutate(updated, false);
      const { data, errors } = await client.models.Inbox.update({
        id,
        note: null,
        formatVersion: 2,
        noteJson: JSON.stringify(note),
      });
      if (errors) handleApiErrors(errors, "Error updating inbox item");
      mutate(updated);
      return data?.id;
    };

  const createActivity = async (createdAt: Date) => {
    const { data, errors } = await client.models.Activity.create({
      finishedOn: toISODateTimeString(createdAt),
      formatVersion: 3,
      notes: null,
      notesJson: null,
    });
    if (errors)
      handleApiErrors(errors, "Error creating activity with inbox notes");
    return data?.id;
  };

  const createTodo = async (block: JSONContent) => {
    if (block.type !== "taskItem") return;
    const { data, errors } = await client.models.Todo.create({
      status: block.attrs?.checked ? "DONE" : "OPEN",
      todo: stringifyBlock(block),
      doneOn: block.attrs?.checked ? newDateString() : null,
    });
    if (errors) handleApiErrors(errors, "Creating todo failed");
    if (!data) return;
    return data.id;
  };

  const createNoteBlock = async (
    activityId: string,
    block: JSONContent,
    parentType?: string
  ) => {
    const todoId = await createTodo(block);
    const { data, errors } = await client.models.NoteBlock.create({
      activityId,
      formatVersion: 3,
      type: !block.type
        ? "paragraph"
        : parentType === "orderedList"
          ? "listItemOrdered"
          : block.type,
      content: !todoId ? stringifyBlock(block) : null,
      ...(!todoId ? {} : { todoId }),
    });
    if (errors) handleApiErrors(errors, "Creating note block failed");
    if (!data) return;

    const peopleIds = flow(
      getPeopleMentioned,
      map(getPersonId),
      compact
    )(block);

    if (peopleIds.length > 0) {
      await Promise.all(
        peopleIds.map((id) => createNoteBlockPerson(data.id, id))
      );
    }

    return data.id;
  };

  const updateActivityBlockIds = async (
    activityId: string,
    blockIds: (string | undefined)[]
  ) => {
    const noteBlockIds = compact(blockIds);
    if (noteBlockIds.length === 0) return;
    const { errors } = await client.models.Activity.update({
      id: activityId,
      noteBlockIds,
    });
    if (errors) handleApiErrors(errors, "Updating activity's block ids failed");
  };

  const createActivityProject = async (
    activityId: string,
    projectId: string
  ) => {
    const { errors } = await client.models.ProjectActivity.create({
      activityId,
      projectsId: projectId,
    });
    if (errors) handleApiErrors(errors, "Linking activity/project failed");
  };

  const addActivityIdToInbox = async (
    inboxItemId: string,
    activityId: string
  ) => {
    const { data, errors } = await client.models.Inbox.update({
      id: inboxItemId,
      status: "done",
      movedToActivityId: activityId,
    });
    if (errors) handleApiErrors(errors, "Linking inbox item/activity failed");
    return data?.id;
  };

  const createNoteBlockPerson = async (blockId: string, personId: string) => {
    const { errors } = await client.models.NoteBlockPerson.create({
      noteBlockId: blockId,
      personId,
    });
    if (errors) handleApiErrors(errors, "Linking note block/person failed");
  };

  const moveInboxItemToProject = async (
    inboxItem: Inbox,
    projectId: string
  ) => {
    const activityId = await createActivity(inboxItem.createdAt);
    if (!activityId) return;

    const blocks = inboxItem.note.content;
    if (blocks) {
      const blockIds = await Promise.all(
        blocks.flatMap((block) =>
          LIST_TYPES.includes(block.type ?? "")
            ? block.content?.map((subBlock) =>
                createNoteBlock(activityId, subBlock, block.type)
              )
            : createNoteBlock(activityId, block)
        )
      );
      await updateActivityBlockIds(activityId, blockIds);
    }

    await createActivityProject(activityId, projectId);
    const inboxItemId = await addActivityIdToInbox(inboxItem.id, activityId);

    return inboxItemId;
  };

  const updateStatus = async (inboxItem: Inbox, status: InboxStatus) => {
    if (inboxItem) mutate({ ...inboxItem, status }, false);
    const { data, errors } = await client.models.Inbox.update({
      id: inboxItem.id,
      status,
    });
    if (errors) handleApiErrors(errors, "Can't update status");
    if (!data) return;
    mutate(mapInbox(data));
    return data.id;
  };

  return { createInboxItem, updateNote, updateStatus, moveInboxItemToProject };
};

export default useInboxWorkflow;
