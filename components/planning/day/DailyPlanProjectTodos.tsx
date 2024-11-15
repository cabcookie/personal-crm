import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import { flow, identity, map } from "lodash/fp";
import { FC } from "react";
import { Button } from "../../ui/button";
import PostPonedTodo from "../todos/PostPonedTodo";
import TodoForDecision from "../todos/TodoForDecision";

type DailyPlanProjectTodosProps = {
  todos: DailyPlanTodo[];
  status: "OPEN" | "DONE" | "POSTPONED";
};

const DailyPlanProjectTodos: FC<DailyPlanProjectTodosProps> = ({
  status,
  todos,
}) => {
  const { updateTodoStatus, postponeTodo } = useDailyPlans("OPEN");

  return flow(
    identity<DailyPlanTodo[]>,
    map((todo) =>
      status === "OPEN" || status === "DONE" ? (
        <TodoForDecision
          key={todo.recordId}
          activityId={todo.activityId}
          content={todo.todo.content}
          todoStatus={todo.done}
          finishTodoOnDailyPlan={() =>
            updateTodoStatus(todo.todoId, status === "OPEN")
          }
        >
          {status === "OPEN" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => postponeTodo(todo.recordId, true)}
            >
              Not today
            </Button>
          )}
        </TodoForDecision>
      ) : (
        <PostPonedTodo
          key={todo.recordId}
          done={todo.done}
          content={todo.todo.content}
          postponeTodo={() => postponeTodo(todo.recordId, false)}
        />
      )
    )
  )(todos);
};

export default DailyPlanProjectTodos;
