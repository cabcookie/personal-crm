import { type Schema } from "@/amplify/data/resource";
import { isNotNil } from "@/helpers/functional";
import {
  getTodoDoneOn,
  getTodoId,
  getTodoJson,
  getTodoStatus,
  notAnOrphan,
} from "@/helpers/todos";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flatMap, flow, get, identity, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { getTodoOrder, Todo } from "./useProjectTodos";
const client = generateClient<Schema>();

export type MeetingTodo = Todo & {
  meetingId: string;
  projectIds: string[];
  blockId: string;
};

const selectionSet = [
  "id",
  "activities.id",
  "activities.forProjects.projectsId",
  "activities.noteBlockIds",
  "activities.noteBlocks.id",
  "activities.noteBlocks.todo.id",
  "activities.noteBlocks.todo.todo",
  "activities.noteBlocks.todo.status",
  "activities.noteBlocks.todo.doneOn",
  "activities.noteBlocks.updatedAt",
] as const;

type MeetingTodoData = SelectionSet<
  Schema["Meeting"]["type"],
  typeof selectionSet
>;
type TodoData = MeetingTodoData["activities"][number]["noteBlocks"][number];

const mapMeetingTodo = ({
  id: meetingId,
  activities,
}: MeetingTodoData): MeetingTodo[] =>
  flow(
    identity<typeof activities>,
    flatMap(({ id: activityId, noteBlocks, noteBlockIds, forProjects }) =>
      flow(
        filter(get("todo")),
        filter(isNotNil),
        filter(notAnOrphan({ noteBlockIds, noteBlocks })),
        flatMap(
          ({ id: blockId, todo, updatedAt }: TodoData): MeetingTodo => ({
            meetingId,
            todoId: getTodoId(todo),
            todo: getTodoJson(todo),
            done: getTodoStatus(todo),
            doneOn: getTodoDoneOn(todo),
            activityId,
            blockId,
            projectIds: map("projectsId")(forProjects),
            updatedAt: new Date(updatedAt),
          })
        )
      )(noteBlocks)
    )
  )(activities);

const fetchMeetingTodos = (meetingId: string | undefined) => async () => {
  if (!meetingId) return [];
  const { data, errors } = await client.models.Meeting.get(
    { id: meetingId },
    {
      selectionSet,
    }
  );
  if (errors) throw errors;
  if (!data) throw new Error("fetchMeetingTodos didn't retrieve data");

  try {
    return flow(mapMeetingTodo, sortBy(getTodoOrder<MeetingTodo>))(data);
  } catch (error) {
    console.error("fetchMeetingTodos", { error });
    throw error;
  }
};
const useMeetingTodos = (meetingId: string | undefined) => {
  const {
    data: meetingTodos,
    isLoading,
    error,
  } = useSWR(`/meetings/${meetingId}/todos`, fetchMeetingTodos(meetingId));
  return { meetingTodos, isLoading, error };
};

export default useMeetingTodos;
