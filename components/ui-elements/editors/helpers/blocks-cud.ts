/* Create, update, delete operations on blocks (i.e., NoteBlock) */
import { createBlockApi } from "@/api/helpers/todo";
import { Activity, TempIdMapping } from "@/api/useActivity";
import { not } from "@/helpers/functional";
import { Editor, JSONContent } from "@tiptap/core";
import { filter, find, flow, map, some } from "lodash/fp";
import { getBlocks, stringifyBlock } from "./blocks";
import { isUpToDate } from "./compare";
import TransactionError from "./transaction-error";
import { client } from "@/lib/amplify";

type TBlockCreationSetTodo = {
  content: null;
  todoId: string;
  type: "taskItem";
};

type TBlockCreationSetRest = {
  content: string;
  todoId?: never;
  type: string;
};

type TBlockCreationSet = (TBlockCreationSetTodo | TBlockCreationSetRest) & {
  tempId: string;
  activityId: string;
};

type TBlockUpdateSet = {
  blockId: string;
  content: string;
  type: string;
};

type TBlockDeleteSet = {
  blockId: string;
};

const doesNotExist = (notes: JSONContent) => (block: JSONContent) =>
  flow(
    getBlocks,
    some((b) => b.attrs?.blockId === block.attrs?.blockId),
    not
  )(notes);

const mapToCreationSet =
  (activityId: string) =>
  (block: JSONContent): TBlockCreationSet => {
    if (!block.attrs?.blockId)
      throw new TransactionError(
        "blockId not set on block that should be stored in database",
        block,
        "mapToCreationSet"
      );
    if (!block.type)
      throw new TransactionError(
        "typeId not set on block that should be stored in database",
        block,
        "mapToCreationSet"
      );
    if (block.type === "taskItem" && !block.attrs?.todoId)
      throw new TransactionError(
        "todoId not set for 'taskItem' block that should be stored in database",
        block,
        "mapToCreationSet"
      );
    if (block.type === "taskItem")
      return {
        tempId: block.attrs.blockId,
        activityId,
        type: "taskItem",
        content: null,
        todoId: block.attrs.todoId,
      };
    return {
      tempId: block.attrs.blockId,
      content: stringifyBlock(block),
      activityId,
      type: block.type,
    };
  };

export const createBlock = async ({
  activityId,
  content,
  tempId,
  todoId,
  type,
}: TBlockCreationSet): Promise<TempIdMapping> => {
  const { data, errors } = await createBlockApi(
    activityId,
    content,
    todoId,
    type
  );
  if (errors)
    throw new TransactionError(
      "Creating note block failed",
      content,
      "createBlock",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Creating note block returned no data",
      content,
      "createBlock"
    );
  return {
    tempId,
    id: data.id,
  };
};

export const getBlockCreationSet = (
  editor: Editor,
  activity: Activity
): TBlockCreationSet[] =>
  flow(
    getBlocks,
    filter(doesNotExist(activity.notes)),
    map(mapToCreationSet(activity.id))
  )(editor.getJSON());

const getBlockById = (blockId: string | undefined) => (content: JSONContent) =>
  !blockId
    ? undefined
    : flow(
        getBlocks,
        find((b) => b.attrs?.blockId && b.attrs.blockId === blockId)
      )(content);

const blockIsUpToDate =
  (editorContent: JSONContent) => (activityContent: JSONContent | undefined) =>
    !activityContent ? true : isUpToDate(editorContent, activityContent);

const filterForChanged =
  (activityContent: JSONContent) =>
  (editorContent: JSONContent): boolean =>
    flow(
      getBlockById(editorContent.attrs?.blockId),
      blockIsUpToDate(editorContent),
      not
    )(activityContent);

const mapUpdateSet = (content: JSONContent): TBlockUpdateSet => {
  if (!content.attrs?.blockId)
    throw new TransactionError(
      "blockId is missig for update set",
      content,
      "mapUpdateSet"
    );
  return {
    blockId: content.attrs.blockId,
    content: stringifyBlock(content),
    type: content.type ?? "paragraph",
  };
};

export const updateBlock = async ({
  blockId,
  content,
  type,
}: TBlockUpdateSet) => {
  const { data, errors } = await client.models.NoteBlock.update({
    id: blockId,
    content,
    formatVersion: 3,
    todoId: null,
    type,
  });
  if (errors)
    throw new TransactionError(
      "Update block failed",
      content,
      "updateBlock",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Update block returned no data",
      content,
      "updateBlock"
    );
  return { blockId, content, type } as TBlockUpdateSet;
};

export const getBlockUpdateSet = (
  editor: Editor,
  activity: Activity
): TBlockUpdateSet[] =>
  flow(
    getBlocks,
    filter((b) => b.type !== "taskItem"),
    filter(filterForChanged(activity.notes)),
    map(mapUpdateSet)
  )(editor.getJSON());

const mapDeleteSet = (block: JSONContent): TBlockDeleteSet => {
  if (!block.attrs?.blockId)
    throw new TransactionError(
      "blockId not set on block should be deleted in database",
      block,
      "mapDeleteSet"
    );
  return {
    blockId: block.attrs.blockId,
  };
};

export const deleteBlock = async ({ blockId }: TBlockDeleteSet) => {
  const { data, errors } = await client.models.NoteBlock.delete({
    id: blockId,
  });
  if (errors)
    throw new TransactionError(
      "Deleting block failed",
      null,
      `deleteBlock(${blockId})`,
      errors
    );
  if (!data)
    throw new TransactionError(
      "Deleting block returned no data",
      null,
      `deleteBlock(${blockId})`,
      errors
    );
};

const emptyBlock = (block: JSONContent): boolean =>
  Boolean(block.attrs?.blockId);

export const getBlockDeleteSet = (
  editor: Editor,
  activity: Activity
): TBlockDeleteSet[] =>
  flow(
    getBlocks,
    filter(emptyBlock),
    filter(doesNotExist(editor.getJSON())),
    map(mapDeleteSet)
  )(activity.notes);
