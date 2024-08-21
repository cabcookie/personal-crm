import { type Schema } from "@/amplify/data/resource";
import { Activity } from "@/api/useActivity";
import { not } from "@/helpers/functional";
import { Editor } from "@tiptap/core";
import { generateClient } from "aws-amplify/api";
import {
  compact,
  filter,
  flatMap,
  flow,
  get,
  isEqual,
  map,
  some,
} from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { getTodos } from "./todos-cud";
import TransactionError from "./transaction-error";
const client = generateClient<Schema>();

type TProjectData = {
  projectId: string;
};

type TTodoData = {
  todoId: string;
  done: boolean;
};

type TProjectTodoData = TProjectData & TTodoData;

const mapProjectTodoData =
  (projects: string[] | undefined) =>
  ({ done, todoId }: TTodoData): TProjectTodoData[] | undefined =>
    projects?.map(
      (projectId): TProjectTodoData => ({
        todoId,
        done,
        projectId,
      })
    );

const mapTodo = (todo: EditorJsonContent): TTodoData => ({
  todoId: todo.attrs?.todoId,
  done: todo.attrs?.checked,
});

const getProjects = (content: EditorJsonContent): undefined | string[] =>
  flow(get("attrs.projects"), map(get("projectsId")))(content);

const mapProjectTodos = (
  content: EditorJsonContent
): ((todo: TTodoData) => TProjectTodoData[] | undefined) =>
  flow(getProjects, mapProjectTodoData)(content);

const getProjectTodos = (content: EditorJsonContent) =>
  flow(
    getTodos,
    map(mapTodo),
    flatMap(mapProjectTodos(content)),
    compact
  )(content);

const existingRecords =
  (filteredByRecords: TProjectTodoData[]) =>
  (referenceRecord: TProjectTodoData) =>
    some(isEqual(referenceRecord))(filteredByRecords);

const filterExisting = flow(getProjectTodos, existingRecords);

const filterMissingRecords = (filteredByRecords: EditorJsonContent) =>
  filter(flow(filterExisting(filteredByRecords), not));

const getChangeSet = (
  referenceRecords: EditorJsonContent,
  filteredByRecords: EditorJsonContent
): TProjectTodoData[] =>
  flow(
    getProjectTodos,
    filterMissingRecords(filteredByRecords)
  )(referenceRecords);

const createProjectTodo = async ({
  todoId,
  ...projectTodoData
}: TProjectTodoData) => {
  const { data, errors } = await client.models.ProjectTodo.create({
    todoId,
    projectIdTodoStatus: makeProjectIdTodoStatus(projectTodoData),
  });
  if (errors)
    throw new TransactionError(
      "Creating project/todo link failed",
      null,
      "createProjectTodo",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Creating project/todo link returned no data",
      null,
      "createProjectTodo"
    );
};

const makeProjectIdTodoStatus = ({
  projectId,
  done,
}: Omit<TProjectTodoData, "todoId">) =>
  `${projectId}-${done ? "DONE" : "OPEN"}`;

const getProjectTodoId = async ({ todoId, projectId }: TProjectTodoData) => {
  const { data, errors } =
    await client.models.ProjectTodo.listProjectTodoByTodoId({ todoId });
  if (errors)
    throw new TransactionError(
      "Getting todos from todoId failed",
      null,
      "getProjectTodo",
      errors
    );
  return data.find((d) => d.projectIdTodoStatus.includes(projectId))?.id;
};

const deleteProjectTodo = async (projectTodoData: TProjectTodoData) => {
  const projectTodoId = await getProjectTodoId(projectTodoData);
  if (!projectTodoId) return;
  const { data, errors } = await client.models.ProjectTodo.delete({
    id: projectTodoId,
  });
  if (errors)
    throw new TransactionError(
      "Deleting project/todo link failed",
      null,
      "deleteProjectTodo",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Deleting project/todo link returned no data",
      null,
      "deleteProjectTodo"
    );
};

export const createAndDeleteProjectTodos = async (
  editor: Editor,
  activity: Activity
) => {
  await Promise.all(
    flow(getChangeSet, map(createProjectTodo))(editor.getJSON(), activity.notes)
  );
  await Promise.all(
    flow(getChangeSet, map(deleteProjectTodo))(activity.notes, editor.getJSON())
  );
};
