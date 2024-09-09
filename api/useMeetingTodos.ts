import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { map } from "lodash";
import { flow, sortBy } from "lodash/fp";
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

const mapMeetingTodo = ({
  id: meetingId,
  activities,
}: MeetingTodoData): MeetingTodo[] =>
  activities.flatMap(({ id: activityId, noteBlocks, forProjects }) =>
    noteBlocks
      .filter((b) => !!b.todo)
      .flatMap(
        ({
          id: blockId,
          todo: { id: todoId, doneOn, status, todo },
          updatedAt,
        }): MeetingTodo => ({
          meetingId,
          todoId,
          todo: JSON.parse(todo as any),
          done: status === "DONE",
          doneOn: !doneOn ? null : new Date(doneOn),
          activityId,
          blockId,
          projectIds: map(forProjects, "projectsId"),
          updatedAt: new Date(updatedAt),
        })
      )
  );

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
