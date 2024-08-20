/* Create, update, delete operations on todos (i.e., Todo) */

import { type Schema } from "@/amplify/data/resource";
import { Activity, TempIdMapping } from "@/api/useActivity";
import { newDateString, newDateTimeString, not } from "@/helpers/functional";
import { Editor } from "@tiptap/core";
import { generateClient } from "aws-amplify/api";
import { filter, find, flatMap, flow, get, map, some } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { stringifyBlock } from "./blocks";
import { isUpToDate } from "./compare";
import TransactionError from "./transaction-error";
const client = generateClient<Schema>();

type TTodoCreationSet = {
  tempId: string;
  done: boolean;
  content: string;
};

type TTodoUpdateSet = {
  todoId: string;
  done: boolean;
  content: string;
};

type TTodoDeleteSet = {
  todoId: string;
};

export const createTodo = async ({
  content,
  done,
  tempId,
}: TTodoCreationSet): Promise<TempIdMapping> => {
  const { data, errors } = await client.models.Todo.create({
    todo: content,
    status: done ? "DONE" : "OPEN",
    doneOn: done ? newDateTimeString() : null,
  });
  if (errors)
    throw new TransactionError(
      "Creating todo failed",
      content,
      "createTodo",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Creating todo returned no data",
      content,
      "createTodo"
    );
  return {
    tempId,
    id: data.id,
  };
};

const doesNotExist = (notes: EditorJsonContent) => (block: EditorJsonContent) =>
  flow(
    getTodos,
    some((t) => t.attrs?.todoId === block.attrs?.todoId),
    not
  )(notes);

const mapTodoToCreationSet = (block: EditorJsonContent): TTodoCreationSet => {
  if (!block.attrs?.todoId)
    throw new TransactionError(
      "todoId not set on todo that should be stored in database",
      block,
      "mapTodoToCreationSet"
    );

  return {
    tempId: block.attrs.todoId,
    done: block.attrs.checked,
    content: stringifyBlock(block),
  };
};

export const getTodos = (content: EditorJsonContent): EditorJsonContent[] =>
  flow(
    get("content"),
    filter((c: EditorJsonContent) => c.type === "taskList"),
    flatMap(get("content"))
  )(content);

export const getTodoCreationSet = (
  editor: Editor,
  activity: Activity
): TTodoCreationSet[] =>
  flow(
    getTodos,
    filter(doesNotExist(activity.notes)),
    map(mapTodoToCreationSet)
  )(editor.getJSON());

const getTodoById =
  (todoId: string | undefined) => (content: EditorJsonContent) =>
    !todoId
      ? undefined
      : flow(
          getTodos,
          find((t) => t.attrs?.todoId && t.attrs.todoId === todoId)
        )(content);

const todoIsUpToDate =
  (editorContent: EditorJsonContent) =>
  (activityContent: EditorJsonContent | undefined) =>
    !activityContent ? true : isUpToDate(editorContent, activityContent);

const filterForChanged =
  (activityContent: EditorJsonContent) =>
  (editorContent: EditorJsonContent): boolean =>
    flow(
      getTodoById(editorContent.attrs?.todoId),
      todoIsUpToDate(editorContent),
      not
    )(activityContent);

const mapUpdateSet = (content: EditorJsonContent): TTodoUpdateSet => {
  if (!content.attrs?.todoId)
    throw new TransactionError(
      "todoId is missing for update set",
      content,
      "mapUpdateSet"
    );
  return {
    content: stringifyBlock(content),
    todoId: content.attrs.todoId,
    done: content.attrs?.checked,
  };
};

const mapTaskItem = (
  changedTodos: TTodoUpdateSet[],
  taskItem: EditorJsonContent
) => {
  const todo = changedTodos.find((t) => t.todoId === taskItem.attrs?.todoId);
  if (!todo) return taskItem;
  const content = JSON.parse(todo.content) as EditorJsonContent;
  return {
    ...content,
    attrs: {
      ...taskItem.attrs,
      ...content.attrs,
    },
  };
};

const mapLevel2 =
  (changedTodos: TTodoUpdateSet[]) => (level2: EditorJsonContent) =>
    level2.type !== "taskItem" || !level2.attrs?.todoId
      ? level2
      : mapTaskItem(changedTodos, level2);

const mapLevel1 =
  (changedTodos: TTodoUpdateSet[]) => (level1: EditorJsonContent) => ({
    ...level1,
    content: level1.content?.map(mapLevel2(changedTodos)),
  });

export const mapChangedTodos = (
  changedTodos: TTodoUpdateSet[],
  activity: Activity
) => ({
  ...activity,
  notes: {
    ...activity.notes,
    content: activity.notes.content?.map(mapLevel1(changedTodos)),
  },
});

export const updateTodo = async ({ todoId, content, done }: TTodoUpdateSet) => {
  const { data, errors } = await client.models.Todo.update({
    id: todoId,
    todo: content,
    status: done ? "DONE" : "OPEN",
    doneOn: done ? newDateString() : null,
  });
  if (errors)
    throw new TransactionError(
      "Update todo failed",
      content,
      "updateTodo",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Update todo returned no data",
      content,
      "updateTodo"
    );
  return { todoId, content, done } as TTodoUpdateSet;
};

export const getTodoUpdateSet = (
  editor: Editor,
  activity: Activity
): TTodoUpdateSet[] =>
  flow(
    getTodos,
    filter(filterForChanged(activity.notes)),
    map(mapUpdateSet)
  )(editor.getJSON());

const mapDeleteSet = (block: EditorJsonContent): TTodoDeleteSet => {
  if (!block.attrs?.todoId)
    throw new TransactionError(
      "todoId not set on todo that should be deleted in database",
      block,
      "mapDeleteSet"
    );
  return {
    todoId: block.attrs.todoId,
  };
};

export const deleteTodo = async ({ todoId }: TTodoDeleteSet) => {
  const { data, errors } = await client.models.Todo.delete({
    id: todoId,
  });
  if (errors)
    throw new TransactionError(
      "Deleting todo failed",
      null,
      `deleteTodo(${todoId})`,
      errors
    );
  if (!data)
    throw new TransactionError(
      "Deleting todo returned no date",
      null,
      `deleteTodo(${todoId})`,
      errors
    );
};

export const getTodoDeleteSet = (
  editor: Editor,
  activity: Activity
): TTodoDeleteSet[] =>
  flow(
    getTodos,
    filter(doesNotExist(editor.getJSON())),
    map(mapDeleteSet)
  )(activity.notes);
