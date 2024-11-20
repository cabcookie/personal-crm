import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { ProjectTodo } from "@/api/useProjectTodos";
import { differenceInMinutes } from "date-fns";
import { filter, flow, get, identity, some } from "lodash/fp";
import { Dispatch, SetStateAction } from "react";

export const setProjectList = (
  dailyPlan: DailyPlan,
  maybe: boolean,
  setList: Dispatch<SetStateAction<DailyPlanProject[] | undefined>>
) =>
  flow(
    identity<DailyPlan>,
    get("projects"),
    filter((p) => p.maybe === maybe),
    setList
  )(dailyPlan);

export const setTodoList = (
  todos: ProjectTodo[] | undefined,
  done: boolean,
  dayPlan: DailyPlan,
  setList: Dispatch<SetStateAction<ProjectTodo[] | undefined>>
) =>
  flow(
    identity<ProjectTodo[] | undefined>,
    filter((todo) => todo.done === done),
    filter(
      (todo) =>
        !done ||
        (!!todo.doneOn && differenceInMinutes(todo.doneOn, dayPlan.day) >= 0)
    ),
    filter(
      (todo) =>
        !flow(
          identity<DailyPlan>,
          get("todos"),
          some((dt) => dt.todoId === todo.todoId && dt.postPoned)
        )(dayPlan)
    ),
    setList
  )(todos);

export const setPostponedTodoList = (
  todos: ProjectTodo[] | undefined,
  dayPlan: DailyPlan,
  setList: Dispatch<SetStateAction<ProjectTodo[] | undefined>>
) =>
  flow(
    identity<ProjectTodo[] | undefined>,
    filter((todo) =>
      flow(
        identity<DailyPlan>,
        get("todos"),
        some((dt) => dt.todoId === todo.todoId && dt.postPoned)
      )(dayPlan)
    ),
    setList
  )(todos);
