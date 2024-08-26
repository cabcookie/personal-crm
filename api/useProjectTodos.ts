import { type Schema } from "@/amplify/data/resource";
import { makeProjectIdTodoStatus } from "@/components/ui-elements/editors/helpers/project-todo-cud";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

export type Todo = {
  todoId: string;
  todo: JSONContent;
  done: boolean;
  doneOn: Date | null;
  activityId: string;
  blockId?: string;
};

export type ProjectTodo = Todo & {
  projectTodoId: string;
};

const selectionSet = [
  "id",
  "todo.id",
  "todo.todo",
  "todo.status",
  "todo.doneOn",
  "todo.activity.activityId",
] as const;

type ProjectTodoData = SelectionSet<
  Schema["ProjectTodo"]["type"],
  typeof selectionSet
>;

const mapProjectTodo = ({
  id: projectTodoId,
  todo: {
    id: todoId,
    activity: { activityId },
    doneOn,
    status,
    todo,
  },
}: ProjectTodoData): ProjectTodo => ({
  projectTodoId,
  todoId,
  todo: JSON.parse(todo as any),
  done: status === "DONE",
  doneOn: !doneOn ? null : new Date(doneOn),
  activityId,
});

const fetchProjectTodos = (projectId: string | undefined) => async () => {
  if (!projectId) return;
  const projectIdTodoStatus = makeProjectIdTodoStatus({
    projectId,
    done: false,
  });
  const { data, errors } =
    await client.models.ProjectTodo.listProjectTodoByProjectIdTodoStatus(
      { projectIdTodoStatus },
      { selectionSet }
    );
  if (errors) throw errors;
  if (!data) throw new Error("fetchProjectTodos didn't retrieve data");
  try {
    return data.map(mapProjectTodo);
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
