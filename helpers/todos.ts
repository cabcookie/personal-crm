import { DailyPlanData } from "@/api/useDailyPlans";
import { flow, get, identity, map } from "lodash/fp";

type TodoData = DailyPlanData["todos"][number]["todo"];

export const getTodoId = (todo: TodoData) => get("id")(todo);

export const getTodoJson = flow(identity<TodoData>, get("todo"), JSON.parse);

export const getTodoStatus = (todo: TodoData) => get("status")(todo) === "DONE";

export const getTodoProjectIds = flow(
  identity<TodoData>,
  get("activity.activity.forProjects"),
  map("projectsId")
);

export const getTodoActivityId = flow(
  identity<TodoData>,
  get("activity.activity.id")
);
