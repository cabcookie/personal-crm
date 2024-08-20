import { Activity } from "@/api/useActivity";
import { logFp } from "@/helpers/functional";
import { Editor } from "@tiptap/core";
import { flow, map } from "lodash/fp";
import {
  createBlock,
  deleteBlock,
  getBlockCreationSet,
  getBlockDeleteSet,
  getBlockUpdateSet,
  updateBlock,
} from "./blocks-cud";
import {
  getBlockIdsUpdateSet,
  mapIds,
  updateActivityBlockIds,
} from "./cleanup-attrs";
import {
  createTodo,
  deleteTodo,
  getTodoCreationSet,
  getTodoDeleteSet,
  getTodoUpdateSet,
  updateTodo,
} from "./todos-cud";

export const createAndDeleteBlocksAndTodos = async (
  editor: Editor,
  activity: Activity
) => {
  /* Delete todos where neccessary */
  await Promise.all(flow(getTodoDeleteSet, map(deleteTodo))(editor, activity));

  /* Delete note blocks where neccessary */
  await Promise.all(
    flow(getBlockDeleteSet, map(deleteBlock))(editor, activity)
  );

  /* Create todos where neccessary */
  const todoIdMapping = await Promise.all(
    flow(getTodoCreationSet, map(createTodo))(editor, activity)
  );
  mapIds(editor, "todoId", todoIdMapping);

  /* Create note blocks where neccessary */
  const blockIdMapping = await Promise.all(
    flow(getBlockCreationSet, map(createBlock))(editor, activity)
  );
  mapIds(editor, "blockId", blockIdMapping);

  /* Update noteBlockIds of Activity if neccessary */
  await flow(
    getBlockIdsUpdateSet,
    logFp("blockIdsUpdateSet"),
    updateActivityBlockIds(activity, editor.getJSON())
  )(editor, activity);
};

export const updateBlocksAndTodos = async (
  editor: Editor,
  activity: Activity
) => {
  /* Update todos where neccessary */
  await Promise.all(
    flow(
      getTodoUpdateSet,
      logFp("todoUpdateSet"),
      map(updateTodo)
    )(editor, activity)
  );

  /* Update note blocks where neccessary */
  await Promise.all(
    flow(
      getBlockUpdateSet,
      logFp("blockUpdateSet"),
      map(updateBlock)
    )(editor, activity)
  );
};
