import { type Schema } from "@/amplify/data/resource";
import { stringifyBlock } from "@/components/ui-elements/editors/helpers/blocks";
import { getPeopleMentioned } from "@/components/ui-elements/editors/helpers/mentioned-people-cud";
import { isNotNil, newDateString } from "@/helpers/functional";
import {
  getTodoDoneOn,
  getTodoId,
  getTodoJson,
  getTodoStatus,
  notAnOrphan,
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
import {
  createActivityApi,
  createProjectActivityApi,
  updateActivityBlockIds,
} from "./helpers/activity";
import { createMentionedPersonApi } from "./helpers/people";
import { createBlockApi, createTodoApi } from "./helpers/todo";
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
type TodoData = ProjectActivityData["activity"]["noteBlocks"][number]["todo"];

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
    filter(notAnOrphan(activity)),
    map((todo: TodoData) => ({
      projectActivityId,
      todoId: getTodoId(todo),
      todo: getTodoJson(todo),
      done: getTodoStatus(todo),
      doneOn: getTodoDoneOn(todo),
      activityId: activity.id,
      updatedAt: new Date(todo.updatedAt),
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

  const createTodoRecord = async (todo: JSONContent) => {
    const { data, errors } = await createTodoApi(stringifyBlock(todo), false);
    if (errors) handleApiErrors(errors, "Creating todo failed");
    return data;
  };

  const createNoteBlockRecord = async (activityId: string, todoId: string) => {
    const { data, errors } = await createBlockApi(
      activityId,
      null,
      todoId,
      "taskItem"
    );
    if (errors) handleApiErrors(errors, "Creating note block failed");
    return data?.id;
  };

  const createMentionedPerson =
    (blockId: string) =>
    async (personId: string): Promise<string | undefined> => {
      const { data, errors } = await createMentionedPersonApi(
        blockId,
        personId
      );
      if (errors) handleApiErrors(errors, "Creating mentioned person failed");
      return data?.id;
    };

  const createMentionedPeople = async (blockId: string, todo: JSONContent) => {
    const peopleIds = await Promise.all(
      flow(
        getPeopleMentioned,
        map("attrs.id"),
        map(createMentionedPerson(blockId))
      )(todo)
    );
    return peopleIds;
  };

  const createTodo = async (todo: JSONContent) => {
    if (!projectId) return;
    const activity = await createActivityApi();
    if (!activity) return;
    const projectActivity = await createProjectActivityApi(
      projectId,
      activity.id
    );
    if (!projectActivity) return;
    const todoBlock = {
      type: "taskItem",
      attrs: {
        checked: false,
      },
      content: todo.content,
    } as JSONContent;
    const todoData = await createTodoRecord(todoBlock);
    if (!todoData) return;
    const blockId = await createNoteBlockRecord(activity.id, todoData.id);
    if (!blockId) return;
    const updatedActivity = await updateActivityBlockIds(activity.id, [
      blockId,
    ]);
    if (!updatedActivity) return;
    await createMentionedPeople(blockId, todo);
    mutate([
      ...(projectTodos ?? []),
      {
        todoId: todoData.id,
        todo: todoBlock,
        done: false,
        doneOn: null,
        activityId: activity.id,
        blockId,
        updatedAt: new Date(),
        projectActivityId: projectActivity.id,
      },
    ]);
    return todoData.id;
  };

  return { projectTodos, isLoading, error, mutate, finishTodo, createTodo };
};

export default useProjectTodos;
