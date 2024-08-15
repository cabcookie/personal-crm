import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { not } from "@/helpers/functional";
import { Editor } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { Transaction } from "@tiptap/pm/state";
import { generateClient } from "aws-amplify/api";
import { compact, flow, get, includes, map } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { BlockMentionedPeople, linkMentionedPeople } from "./people-mentioned";
import { createTodoAndNoteBlock } from "./todo";
import { BlockIdMapping } from "./update-notes";
const client = generateClient<Schema>();

export const createNoteBlockApi = async (
  activityId: string,
  block: EditorJsonContent,
  todoId?: string
) => {
  const { data, errors } = await client.models.NoteBlock.create({
    activityId,
    formatVersion: 3,
    content: !todoId ? stringifyBlock(block) : null,
    type: todoId ? "taskItem" : block.type ?? "paragraph",
    todoId,
  });
  if (errors) {
    handleApiErrors(errors, "Creating Note Block failed");
    throw errors;
  }
  return data;
};

const createNoteBlock = async (
  activityId: string,
  blocksMentionedPeople: BlockMentionedPeople[],
  block: EditorJsonContent
) => {
  const data = await createNoteBlockApi(activityId, block);
  if (!data) return;
  await linkMentionedPeople(blocksMentionedPeople, data.id, block);
  return data.id;
};

export const blocksToBeCreated =
  (existingBlocks: EditorJsonContent) =>
  (editorBlock: EditorJsonContent | undefined): boolean =>
    (editorBlock &&
      flow(getBlockId, (blockId) =>
        flow(getBlockIds, compact, includes(blockId), not)(existingBlocks)
      )(editorBlock)) ??
    false;

export const createBlock =
  (
    activityId: string,
    blocksMentionedPeople: BlockMentionedPeople[],
    projectIds: string[]
  ) =>
  (block: EditorJsonContent) => {
    if (block.type === "taskItem")
      return createTodoAndNoteBlock(
        activityId,
        blocksMentionedPeople,
        projectIds,
        block
      );
    return createNoteBlock(activityId, blocksMentionedPeople, block);
  };

export const mapBlockIds = (mapping: BlockIdMapping[]) =>
  mapping.map((m) => m.blockId);

export const updateBlockIds = async (
  activityId: string,
  blockIds: (string | undefined)[]
) => {
  const { data, errors } = await client.models.Activity.update({
    id: activityId,
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

export const getBlockFromId =
  <T extends BlockMentionedPeople>(blocks: T[]) =>
  (blockId: string): T | undefined =>
    blocks.find((b) => b.id === blockId);

const getBlockId = (block: EditorJsonContent): string | null =>
  get("attrs.blockId")(block) ?? null;

export const getBlockIds = (
  editorContent: EditorJsonContent | undefined
): (string | null)[] =>
  !editorContent ? [] : flow(getBlocks, map(getBlockId))(editorContent);

export const updateTempBlockIds =
  (editor: Editor) => (mappedIds: BlockIdMapping[]) => {
    const { view } = editor;
    const { state, dispatch } = view;
    const { tr, doc } = state;
    const updateTr = tr.setMeta("addToHistory", false);

    doc.descendants((node, nodePos) => {
      const mappedId = mappedIds.find(
        (m) => m.tempId && m.tempId === node.attrs.blockId
      );
      if (mappedId?.blockId) {
        updateTr.setNodeMarkup(nodePos, null, {
          ...node.attrs,
          blockId: mappedId.blockId,
        });
      }
      return true;
    });

    if (updateTr.steps.length > 0) {
      dispatch(updateTr);
    }
    return mappedIds;
  };

const setTemporaryBlockId = (
  mapping: BlockIdMapping[],
  transaction: Transaction,
  node: Node,
  position: number
) => {
  const tempId = crypto.randomUUID();
  mapping.push({
    tempId,
    content: node.toJSON(),
  });
  transaction.setNodeMarkup(position, null, {
    ...node.attrs,
    blockId: tempId,
  });
};

const resetBlockId = (
  transaction: Transaction,
  position: number,
  node: Node
) => {
  transaction.setNodeMarkup(position, null, {
    ...node.attrs,
    blockId: null,
  });
};

export const getBlockCreationSet = (editor: Editor) => {
  const { view } = editor;
  const { state, dispatch } = view;
  const { tr, doc } = state;

  const tempIdMapping: BlockIdMapping[] = [];
  const updateTr = tr.setMeta("addToHistory", false);

  doc.descendants((node, nodePos, parent) => {
    if (!parent) return true;
    if (["doc", "bulletList", "taskList"].includes(parent.type.name)) {
      if (node.attrs.blockId === null) {
        setTemporaryBlockId(tempIdMapping, updateTr, node, nodePos);
      } else if (node.attrs.blockId !== undefined) {
        tempIdMapping.push({
          blockId: node.attrs.blockId,
        });
      }
    } else {
      if (node.attrs.blockId) {
        resetBlockId(updateTr, nodePos, node);
      }
    }
    return true;
  });

  console.log("Transaction steps", updateTr.steps);

  if (updateTr.steps.length > 0) {
    dispatch(updateTr);
  }

  return tempIdMapping;
};
