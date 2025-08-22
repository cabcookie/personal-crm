import { newDateString } from "@/helpers/functional";
import { CrudOptions, handleApiErrors } from "../globals";
import { client } from "@/lib/amplify";

interface DataProps {
  todoId: string;
  done: boolean;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

export const finishTodo = async ({
  data: { todoId, done },
  options,
}: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.Todo.update({
    id: todoId,
    status: done ? "DONE" : "OPEN",
    doneOn: done ? newDateString() : undefined,
  });
  if (errors) handleApiErrors(errors, "Updating todo's done state failed");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
