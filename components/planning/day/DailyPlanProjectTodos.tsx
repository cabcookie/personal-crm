import { ProjectTodo } from "@/api/useProjectTodos";
import { FC } from "react";
import PostPonedTodo from "../todos/PostPonedTodo";
import DailyPlanProjectTodo from "./DailyPlanProjectTodo";
import PostponeBtn from "./PostponeBtn";

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
      >
        {status === "OPEN" && postponeTodo && (
          <PostponeBtn
            label="Not today"
            postponeTodo={postponeTodo}
            todoId={todo.todoId}
          />
        )}
      </DailyPlanProjectTodo>
    ) : (
      <PostPonedTodo
        key={todo.todoId}
        todo={todo}
        postponeTodo={activateTodo}
      />
    )
  );
};

export default DailyPlanProjectTodos;
