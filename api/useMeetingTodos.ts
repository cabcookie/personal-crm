import { type Schema } from "@/amplify/data/resource";
import {
  getTodoDoneOn,
  getTodoId,
  getTodoJson,
  getTodoStatus,
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
  "activities.noteBlocks.todo.updatedAt",
] as const;

type MeetingTodoData = SelectionSet<
  Schema["Meeting"]["type"],
  typeof selectionSet
>;

const mapMeetingTodo = (meeting: MeetingTodoData): MeetingTodo[] =>
  flow(
    identity<typeof meeting>,
    get("activities"),
    flatMap(({ id: activityId, noteBlocks, noteBlockIds, forProjects }) =>
      flow(
        identity<typeof noteBlocks>,
        filter((block) =>
          noteBlocks.some(
            (b) => noteBlockIds?.includes(b.id) && b.todo.id === block.todo.id
          )
        ),
        map(
          ({ id: blockId, todo }): MeetingTodo => ({
            meetingId: meeting.id,
            todoId: getTodoId(todo),
            todo: getTodoJson(todo),
            done: getTodoStatus(todo),
            doneOn: getTodoDoneOn(todo),
            activityId,
            blockId,
            projectIds: map("projectsId")(forProjects),
            updatedAt: new Date(todo.updatedAt),
          })
        )
      )(noteBlocks)
    )
  )(meeting);

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
    return flow(
      identity<typeof data>,
      mapMeetingTodo,
      sortBy(getTodoOrder<MeetingTodo>)
    )(data);
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
    mutate,
  } = useSWR(`/meetings/${meetingId}/todos`, fetchMeetingTodos(meetingId));
  return { meetingTodos, isLoading, error, mutate };
};

export default useMeetingTodos;
