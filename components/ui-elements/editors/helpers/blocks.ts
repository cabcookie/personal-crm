import { flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";

const cleanUpBlocksBlockId = (json: EditorJsonContent): EditorJsonContent => {
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

export const getBlocks = (
  json: EditorJsonContent
): EditorJsonContent[] | undefined =>
  json.content?.flatMap((c) =>
    c.type && ["bulletList", "taskList"].includes(c.type) ? c.content : c
  );

const getBlockId = (block: EditorJsonContent): string | null =>
  get("attrs.blockId")(block) ?? null;

export const getBlockIds = (
  editorContent: EditorJsonContent | undefined
): (string | null)[] =>
  !editorContent ? [] : flow(getBlocks, map(getBlockId))(editorContent);
