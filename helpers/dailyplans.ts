import { Project } from "@/api/ContextProjects";
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

export const getTodosProjectIds = flow(
  identity<DailyPlanTodo[]>,
  flatMap("projectIds"),
  uniq
);

export const getOpenTodos = (project: Project, todos: DailyPlanTodo[]) =>
  flow(
    identity<DailyPlanTodo[]>,
    filter((p) => p.projectIds.includes(project.id)),
    filter((p) => !p.done && !p.postPoned)
  )(todos);

export const getClosedTodos = (project: Project, todos: DailyPlanTodo[]) =>
  flow(
    identity<DailyPlanTodo[]>,
    filter((p) => p.projectIds.includes(project.id)),
    filter((p) => p.done)
  )(todos);

export const getPostponedTodos = (project: Project, todos: DailyPlanTodo[]) =>
  flow(
    identity<DailyPlanTodo[]>,
    filter((p) => p.projectIds.includes(project.id)),
    filter((p) => !p.done && p.postPoned)
  )(todos);

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
