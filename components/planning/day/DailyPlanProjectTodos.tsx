import { ProjectTodo } from "@/api/useProjectTodos";
import { FC } from "react";
import DailyPlanProjectTodo from "./DailyPlanProjectTodo";

interface DailyPlanTodo {
  todoId: string;
  postPoned?: boolean;
  done?: boolean;
}

type DailyPlanProjectTodosProps = {
  dayPlanId: string;
  todos: ProjectTodo[] | undefined;
  mutate: (todo: DailyPlanTodo, refresh: boolean) => void;
  status: "OPEN" | "DONE" | "POSTPONED";
};

const DailyPlanProjectTodos: FC<DailyPlanProjectTodosProps> = ({
  dayPlanId,
  status,
  mutate,
  todos,
}) =>
  todos?.map((todo) => (
    <DailyPlanProjectTodo
      key={todo.todoId}
      {...{ mutate, status, dayPlanId, todo }}
    />
  ));

export default DailyPlanProjectTodos;
