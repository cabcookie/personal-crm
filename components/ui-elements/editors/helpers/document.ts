import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { compact, flatMap, flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";

export const cleanUpBlocksBlockId = (
  json: EditorJsonContent
): EditorJsonContent => {
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

export const getMentionedPeopleFromBlock = (
  block: NoteBlockData | undefined
): string[] =>
  !block ? [] : flow(map(get("personId")), compact)(block.people);

export const getMentionedPeopleFromBlocks = (activity: {
  noteBlocks: ActivityData["noteBlocks"];
  noteBlockIds: ActivityData["noteBlockIds"];
}): string[] =>
  flow(
    map(getBlockFromId(activity.noteBlocks)),
    compact,
    flatMap(getMentionedPeopleFromBlock)
  )(activity.noteBlockIds);

export const emptyDocument: EditorJsonContent = {
  type: "doc",
  content: [],
};
