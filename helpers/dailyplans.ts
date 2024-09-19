import { DailyPlanData, DailyPlanTodo } from "@/api/useDailyPlans";
import {
  getTodoActivityId,
  getTodoId,
  getTodoJson,
  getTodoProjectIds,
  getTodoStatus,
  TodoData,
} from "@/helpers/todos";
import { filter, flatMap, flow, get, identity, map, uniq } from "lodash/fp";

const mapDailyPlanTodo: (todo: {
  id: string;
  todo: TodoData;
}) => DailyPlanTodo = ({ id, todo }) => ({
  recordId: id,
  todoId: getTodoId(todo),
  todo: getTodoJson(todo),
  done: getTodoStatus(todo),
  projectIds: getTodoProjectIds(todo),
  activityId: getTodoActivityId(todo),
});

export const getTodosProjectIds = flow(
  identity<DailyPlanTodo[]>,
  flatMap("projectIds"),
  uniq
);

export const getTodos = flow(
  identity<DailyPlanData["todos"]>,
  filter(get("todo.activity.activity.id")),
  map(mapDailyPlanTodo)
);
