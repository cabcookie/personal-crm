import { newDateString } from "@/helpers/functional";
import { client } from "@/lib/amplify";

export const createTodoApi = (content: string, done: boolean) =>
  client.models.Todo.create({
    todo: content,
    status: done ? "DONE" : "OPEN",
    doneOn: done ? newDateString() : null,
  });

export const createBlockApi = (
  activityId: string,
  content: string | null,
  todoId: string | undefined,
  type: string
) =>
  client.models.NoteBlock.create({
    activityId,
    formatVersion: 3,
    type,
    content,
    todoId,
  });
