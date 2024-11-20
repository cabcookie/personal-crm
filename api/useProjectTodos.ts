import { type Schema } from "@/amplify/data/resource";
import { isNotNil, newDateString } from "@/helpers/functional";
import {
  getTodoDoneOn,
  getTodoId,
  getTodoJson,
  getTodoStatus,
  todoIsOrphan,
} from "@/helpers/todos";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  includes,
  map,
  sortBy,
} from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type Todo = {
  todoId: string;
  todo: JSONContent;
  done: boolean;
  doneOn: Date | null;
  activityId: string;
  blockId?: string;
  isOrphan: boolean;
  updatedAt: Date;
};

export type ProjectTodo = Todo & {
  projectActivityId: string;
};

const selectionSet = [
  "id",
  "activity.id",
  "activity.noteBlockIds",
  "activity.noteBlocks.id",
  "activity.noteBlocks.todo.id",
  "activity.noteBlocks.todo.todo",
  "activity.noteBlocks.todo.status",
  "activity.noteBlocks.todo.doneOn",
  "activity.noteBlocks.todo.updatedAt",
] as const;

export type ProjectActivityData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;

const activeNoteBlock = (activity: ProjectActivityData["activity"]) =>
  flow(
    identity<ProjectActivityData["activity"]["noteBlocks"][number]>,
    (noteBlock) =>
      flow(
        identity<ProjectActivityData["activity"]>,
        get("noteBlockIds"),
        includes(noteBlock.id)
      )(activity)
  );

const mapProjectTodo = ({
  id: projectActivityId,
  activity,
}: ProjectActivityData): ProjectTodo[] =>
  flow(
    identity<ProjectActivityData["activity"]>,
    get("noteBlocks"),
    filter(activeNoteBlock(activity)),
    map("todo"),
    filter(isNotNil),
    map(
      (
        todo: ProjectActivityData["activity"]["noteBlocks"][number]["todo"]
      ) => ({
        projectActivityId,
        todoId: getTodoId(todo),
        todo: getTodoJson(todo),
        done: getTodoStatus(todo),
        doneOn: getTodoDoneOn(todo),
        activityId: activity.id,
        isOrphan: todoIsOrphan(todo, activity),
        updatedAt: new Date(todo.updatedAt),
      })
    )
  )(activity);

const makeDateNumber = (date: Date) => parseInt(format(date, "yyyyMMdd"));

interface GetTodoOrder {
  done: boolean;
  doneOn: Date | null;
  updatedAt: Date;
}
export const getTodoOrder = <T extends GetTodoOrder>({
  done,
  doneOn,
  updatedAt,
}: T) =>
  [
    [done ? 0 : 1, 1],
    [makeDateNumber(doneOn ?? updatedAt), 100000000],
  ].reduce((acc, curr) => acc * curr[1] - curr[0], 0);

const fetchProjectTodos = (projectId: string | undefined) => async () => {
  if (!projectId) return;
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId(
      {
        projectsId: projectId,
      },
      { selectionSet }
    );
  if (errors) throw errors;
  if (!data) throw new Error("fetchProjectTodos didn't retrieve data");
  try {
    return flow(
      flatMap(mapProjectTodo),
      sortBy(getTodoOrder<ProjectTodo>)
    )(data);
  } catch (error) {
    console.error("fetchProjectTodos", { error });
    throw error;
  }
};
const useProjectTodos = (projectId: string | undefined) => {
  const {
    data: projectTodos,
    isLoading,
    error,
    mutate,
  } = useSWR(`/project-todos/${projectId}`, fetchProjectTodos(projectId));

  const finishTodo = async (todoId: string, done: boolean) => {
    const updated = projectTodos?.map((t) =>
      t.todoId !== todoId ? t : { ...t, done }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Todo.update({
      id: todoId,
      status: done ? "DONE" : "OPEN",
      doneOn: done ? newDateString() : null,
    });
    if (errors) handleApiErrors(errors, "Updating todo's done state failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  return { projectTodos, isLoading, error, finishTodo };
};

export default useProjectTodos;
