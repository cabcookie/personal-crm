import { ProjectTodo } from "@/api/useProjectTodos";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FC } from "react";
import DailyPlanProjectTodo from "./DailyPlanProjectTodo";

type DailyPlanProjectTodosProps = {
  todos: ProjectTodo[] | undefined;
  finishTodo?: (todoId: string, done: boolean) => void;
  postponeTodo?: (todoId: string) => void;
  activateTodo?: (todoId: string) => void;
  status: "OPEN" | "DONE" | "POSTPONED";
};

const DailyPlanProjectTodos: FC<DailyPlanProjectTodosProps> = ({
  status,
  todos,
  finishTodo,
  postponeTodo,
  activateTodo,
}) => {
  return todos?.map((todo) =>
    status === "OPEN" || status === "DONE" ? (
      <DailyPlanProjectTodo
        key={todo.todoId}
        todo={todo}
        finishTodo={
          !finishTodo ? undefined : (done) => finishTodo(todo.todoId, done)
        }
        postponeTodo={
          !postponeTodo ? undefined : () => postponeTodo(todo.todoId)
        }
        activateTodo={
          !activateTodo ? undefined : () => activateTodo(todo.todoId)
        }
      >
        {status === "OPEN" && postponeTodo && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => postponeTodo(todo.todoId)}
          >
            Not today
          </Button>
        )}
        {todo.doneOn && format(todo.doneOn, "PPp")}
      </DailyPlanProjectTodo>
    ) : (
      "POSTPONED TODO"
    )
  );
};

export default DailyPlanProjectTodos;
