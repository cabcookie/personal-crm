import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { generateClient } from "aws-amplify/api";
import { flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";
import { linkMentionedPeople } from "./people-mentioned";
import { createTodoAndNoteBlock } from "./todo";
const client = generateClient<Schema>();

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

export const createBlock =
  (activity: ActivityData) => async (block: EditorJsonContent) => {
    if (block.type === "taskItem")
      return createTodoAndNoteBlock(activity, block);
    return createNoteBlock(activity, block);
  };

export const updateBlockIds = async (
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

const cleanUpBlocksBlockId = (json: EditorJsonContent): EditorJsonContent => {
  const { attrs = {}, content, ...block } = json;
  const { blockId: _b, ...rest } = attrs;
  return { ...block, attrs: rest, content: content?.map(cleanUpBlocksBlockId) };
};

export const stringifyBlock = flow(cleanUpBlocksBlockId, JSON.stringify);

export const getBlocks = (
  json: EditorJsonContent
): EditorJsonContent[] | undefined =>
  json.content?.flatMap((c) =>
    c.type && ["bulletList", "taskList"].includes(c.type) ? c.content : c
  );

export const getBlockFromId =
  (blocks: NoteBlockData[]) =>
  (blockId: string): NoteBlockData | undefined =>
    blocks.find((b) => b.id === blockId);

export const getBlockIds = flow(getBlocks, map(get("attrs.blockId")));
