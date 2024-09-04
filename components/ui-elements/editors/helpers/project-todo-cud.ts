import { type Schema } from "@/amplify/data/resource";
import { Activity, ProjectLinkData } from "@/api/useActivity";
import { not } from "@/helpers/functional";
import { Editor, JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/api";
import {
  compact,
  filter,
  flatMap,
  flow,
  get,
  identity,
  includes,
  map,
  replace,
} from "lodash/fp";
import { getTodos } from "./todos-cud";
import TransactionError from "./transaction-error";
const client = generateClient<Schema>();

type TTodoData = {
  projects: ProjectLinkData[] | undefined;
  todoId: string;
  done: boolean;
};

type TProjectTodoData = {
  todoId: string;
  projectTodoId?: string;
  projectId: string;
  done: boolean;
};

const existingProjects =
  (projects: ProjectLinkData[]) => (project: ProjectLinkData) =>
    flow(map("projectsId"), includes(get("projectsId")(project)))(projects);

const notExistingProjects =
  (projects: ProjectLinkData[]) => (project: ProjectLinkData) =>
    flow(
      identity<ProjectLinkData[]>,
      map("projectsId"),
      includes(project.projectsId),
      not
    )(projects);

const omitId = ({ projectsId }: ProjectLinkData) => ({ projectsId });

const mapCreateTodo =
  (projects: ProjectLinkData[]) =>
  (todo: JSONContent): TTodoData => ({
    todoId: todo.attrs?.todoId,
    projects: [
      ...flow(get("projects"), filter(existingProjects(projects)))(todo.attrs),
      ...flow(
        filter(notExistingProjects(get("projects")(todo.attrs))),
        map(omitId)
      )(projects),
    ],
    done: todo.attrs?.checked,
  });

const mapDeleteTodo =
  (projects: ProjectLinkData[]) =>
  (todo: JSONContent): TTodoData => ({
    todoId: todo.attrs?.todoId,
    projects: flow(
      get("projects"),
      filter(notExistingProjects(projects))
    )(todo.attrs),
    done: todo.attrs?.checked,
  });

const mapProjectTodos = (todo: TTodoData): TProjectTodoData[] | undefined =>
  flow(
    identity<TTodoData>,
    get("projects"),
    map(
      ({ id, projectsId }): TProjectTodoData => ({
        projectTodoId: id,
        todoId: todo.todoId,
        projectId: projectsId,
        done: todo.done,
      })
    )
  )(todo);

const existingProjectTodo = (projectTodo: TProjectTodoData) =>
  !projectTodo.projectTodoId;

const getCreateSet = (
  content: JSONContent,
  projects: ProjectLinkData[]
): TProjectTodoData[] =>
  flow(
    identity<JSONContent>,
    getTodos,
    map(mapCreateTodo(projects)),
    flatMap(mapProjectTodos),
    compact,
    filter(existingProjectTodo)
  )(content);

const getDeleteSet = (
  content: JSONContent,
  projects: ProjectLinkData[]
): TProjectTodoData[] =>
  flow(
    identity<JSONContent>,
    getTodos,
    map(mapDeleteTodo(projects)),
    flatMap(mapProjectTodos),
    compact
  )(content);

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

export const replaceProjectIdTodoStatus = flow(
  identity<string>,
  replace("-DONE", ""),
  replace("-OPEN", "")
);

export const makeProjectIdTodoStatus = ({
  projectId,
  done,
}: Pick<TProjectTodoData, "done" | "projectId">) =>
  `${projectId}-${done ? "DONE" : "OPEN"}`;

const deleteProjectTodo = async ({ projectTodoId }: TProjectTodoData) => {
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
    flow(getCreateSet, map(createProjectTodo))(
      editor.getJSON(),
      activity.projects
    )
  );
  await Promise.all(
    flow(getDeleteSet, map(deleteProjectTodo))(
      editor.getJSON(),
      activity.projects
    )
  );
};
