import { JSONContent } from "@tiptap/core";
import { flow, get, map } from "lodash/fp";

export const LIST_TYPES = ["bulletList", "orderedList", "taskList"];

const cleanUpBlocksBlockId = (json: JSONContent): JSONContent => {
  const { attrs = {}, content, ...block } = json;
  const {
    blockId: _b,
    projects: _p,
    recordId: _r,
    todoId: _t,
    ...rest
  } = attrs;
  return {
    ...block,
    ...(Object.keys(rest).length === 0 ? {} : { attrs: rest }),
    content: content?.map(cleanUpBlocksBlockId),
  };
};

export const stringifyBlock = flow(cleanUpBlocksBlockId, JSON.stringify);

export const getBlocks = (json: JSONContent): JSONContent[] | undefined =>
  json.content?.flatMap((c) =>
    c.type && LIST_TYPES.includes(c.type) ? c.content : c
  );

const getBlockId = (block: JSONContent): string | null =>
  get("attrs.blockId")(block) ?? null;

export const getBlockIds = (
  editorContent: JSONContent | undefined
): (string | null)[] =>
  !editorContent ? [] : flow(getBlocks, map(getBlockId))(editorContent);
