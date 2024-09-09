import { type Schema } from "@/amplify/data/resource";
import { not } from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  isNil,
  map,
  sortBy,
} from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

export type Todo = {
  todoId: string;
  todo: JSONContent;
  done: boolean;
  doneOn: Date | null;
  activityId: string;
  blockId?: string;
  updatedAt: Date;
};

export type ProjectTodo = Todo & {
  projectActivityId: string;
};

const selectionSet = [
  "id",
  "activity.id",
  "activity.noteBlocks.todo.id",
  "activity.noteBlocks.todo.todo",
  "activity.noteBlocks.todo.status",
  "activity.noteBlocks.todo.doneOn",
  "activity.noteBlocks.todo.updatedAt",
] as const;

type ProjectActivityData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;

const mapProjectTodo = ({
  id: projectActivityId,
  activity,
}: ProjectActivityData): ProjectTodo[] =>
  flow(
    identity<ProjectActivityData["activity"]>,
    get("noteBlocks"),
    map("todo"),
    filter(flow(isNil, not)),
    map(({ id: todoId, todo, status, doneOn, updatedAt }) => ({
      projectActivityId,
      todoId,
      todo: JSON.parse(todo as any),
      done: status === "DONE",
      doneOn: !doneOn ? null : new Date(doneOn),
      activityId: activity.id,
      updatedAt: new Date(updatedAt),
    }))
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
  } = useSWR(`/project-todos/${projectId}`, fetchProjectTodos(projectId));
  return { projectTodos, isLoading, error };
};

export default useProjectTodos;
