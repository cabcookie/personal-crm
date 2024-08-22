import { type Schema } from "@/amplify/data/resource";
import { EditorJsonContent } from "@/components/ui-elements/editors/notes-editor/useExtensions";
import { generateClient, SelectionSet } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

export type MeetingTodo = {
  meetingId: string;
  todoId: string;
  todo: EditorJsonContent;
  done: boolean;
  doneOn: Date | null;
  activityId: string;
  blockId: string;
};

const selectionSet = [
  "id",
  "activities.id",
  "activities.noteBlocks.id",
  "activities.noteBlocks.todo.id",
  "activities.noteBlocks.todo.todo",
  "activities.noteBlocks.todo.status",
  "activities.noteBlocks.todo.doneOn",
] as const;

type MeetingTodoData = SelectionSet<
  Schema["Meeting"]["type"],
  typeof selectionSet
>;

const mapMeetingTodo = ({
  id: meetingId,
  activities,
}: MeetingTodoData): MeetingTodo[] =>
  activities.flatMap(({ id: activityId, noteBlocks }) =>
    noteBlocks
      .filter((b) => !!b.todo)
      .flatMap(
        ({
          id: blockId,
          todo: { id: todoId, doneOn, status, todo },
        }): MeetingTodo => ({
          meetingId,
          todoId,
          todo: JSON.parse(todo as any),
          done: status === "DONE",
          doneOn: !doneOn ? null : new Date(doneOn),
          activityId,
          blockId,
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
    const result = mapMeetingTodo(data);
    return result;
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
