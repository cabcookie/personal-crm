import { DailyPlanData, DailyPlanTodo } from "@/api/useDailyPlans";
import {
  getTodoActivityId,
  getTodoId,
  getTodoJson,
  getTodoProjectIds,
  getTodoStatus,
  TodoData,
} from "@/helpers/todos";
import { filter, flow, get, identity, map } from "lodash/fp";

const mapDailyPlanTodo: (todo: {
  id: string;
  todo: TodoData;
  postPoned?: boolean | null;
}) => DailyPlanTodo = ({ id, todo, postPoned }) => ({
  recordId: id,
  todoId: getTodoId(todo),
  todo: getTodoJson(todo),
  done: getTodoStatus(todo),
  projectIds: getTodoProjectIds(todo),
  activityId: getTodoActivityId(todo),
  postPoned: !!postPoned,
});

export const getTodos = flow(
  identity<DailyPlanData["todos"]>,
  filter(get("todo.activity.activity.id")),
  map(mapDailyPlanTodo)
);
