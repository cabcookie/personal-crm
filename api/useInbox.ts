import { type Schema } from "@/amplify/data/resource";
import {
  addActivityIdToInbox,
  createNoteBlock,
  updateMovedItemToPersonId,
} from "@/components/inbox/helpers";
import {
  LIST_TYPES,
  stringifyBlock,
} from "@/components/ui-elements/editors/helpers/blocks";
import { newDateTimeString, toISODateString } from "@/helpers/functional";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { Editor, JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/data";
import { debounce } from "lodash";
import { compact } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  createActivityApi,
  createProjectActivityApi,
  updateActivityBlockIds,
} from "./helpers/activity";
const client = generateClient<Schema>();

export type HandleMutationFn = (item: Inbox, callApi?: boolean) => void;

export type InboxStatus = Schema["InboxStatus"]["type"];

export type Inbox = {
  id: string;
  note: JSONContent;
  status: InboxStatus;
  createdAt: Date;
  updatedAt: Date;
};

type ApiResponse = Promise<string | undefined>;
type UpdateInboxFn = (id: string, editor: Editor) => ApiResponse;

export const debouncedOnChangeInboxNote = debounce(
  async (id: string, editor: Editor, updateNote: UpdateInboxFn) => {
    const data = await updateNote(id, editor);
    if (!data) return;
  },
  1500
);

type MapInboxFn = (data: Schema["Inbox"]["type"]) => Inbox;

export const mapInbox: MapInboxFn = ({
  id,
  note,
  createdAt,
  formatVersion,
  status,
  noteJson,
  updatedAt,
}) => ({
  id,
  status,
  note: transformNotesVersion({
    formatVersion,
    notes: note,
    notesJson: noteJson,
  }),
  createdAt: new Date(createdAt),
  updatedAt: new Date(updatedAt),
});

const fetchInbox = async () => {
  const { data, errors } = await client.models.Inbox.byStatus(
    {
      status: "new",
    },
    { sortDirection: "ASC" }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading inbox items");
    throw errors;
  }
  try {
    return data.map(mapInbox);
  } catch (error) {
    console.error("fetchInbox", { error });
    throw error;
  }
};

const useInbox = () => {
  const {
    data: inbox,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/inbox", fetchInbox);

  const createInboxItem = async (note: JSONContent) => {
    const updated = [
      ...(inbox ?? []),
      {
        id: "new",
        status: "new",
        note,
        createdAt: new Date(),
      } as Inbox,
    ];
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Inbox.create({
      noteJson: JSON.stringify(note),
      note: null,
      formatVersion: 2,
      status: "new",
      createdAt: newDateTimeString(),
    });
    if (errors) handleApiErrors(errors, "Error creating inbox item");
    if (updated) mutate(updated);
    return data;
  };

  const setInboxItemDone = async (itemId: string) => {
    const updated = inbox?.filter((i) => i.id !== itemId);
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Inbox.update({
      id: itemId,
      status: "done",
    });
    if (errors) handleApiErrors(errors, "Error updating inbox item");
    if (updated) mutate(updated);
    return data;
  };

  const updateNote = async (id: string, editor: Editor) => {
    const note = editor.getJSON();
    const updated = inbox?.map((item) =>
      item.id !== id
        ? item
        : {
            ...item,
            note,
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Inbox.update({
      id,
      note: null,
      formatVersion: 2,
      noteJson: JSON.stringify(note),
    });
    if (errors) handleApiErrors(errors, "Error updating inbox item");
    if (updated) mutate(updated);
    return data?.id;
  };

  const moveItemToProject = async (item: Inbox, projectId: string) => {
    const activity = await createActivityApi(item.createdAt);
    if (!activity) return;

    const updated = inbox?.filter((i) => i.id !== item.id);
    if (updated) mutate(updated, false);
    const blocks = item.note.content;
    if (blocks) {
      const blockIds = await Promise.all(
        blocks.flatMap((block) =>
          LIST_TYPES.includes(block.type ?? "")
            ? block.content?.map((subBlock) =>
                createNoteBlock(activity.id, subBlock, block.type)
              )
            : createNoteBlock(activity.id, block)
        )
      );
      await updateActivityBlockIds(activity.id, compact(blockIds));
    }

    await createProjectActivityApi(projectId, activity.id);
    const itemId = await addActivityIdToInbox(item.id, activity.id);

    if (updated) mutate(updated);
    return itemId;
  };

  const moveItemToPerson = async (
    item: Inbox,
    personId: string,
    withPrayer?: boolean
  ) => {
    const updated = inbox?.filter((i) => i.id !== item.id);
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.create({
      personId,
      learnedOn: toISODateString(item.createdAt),
      learning: stringifyBlock(item.note),
      prayer: !withPrayer ? undefined : "PRAYING",
    });
    if (errors) handleApiErrors(errors, "Error moving inbox item to person");
    if (updated) mutate(updated);
    if (!data) return;
    await updateMovedItemToPersonId(item.id, data.id);
    return data.id;
  };

  return {
    inbox,
    error,
    isLoading,
    createInboxItem,
    updateNote,
    setInboxItemDone,
    moveItemToProject,
    moveItemToPerson,
  };
};

export default useInbox;
