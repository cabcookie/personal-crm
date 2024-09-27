import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { DailyPlanTodo } from "@/api/useDailyPlans";
import { every, filter, flow, identity, map, sortBy } from "lodash/fp";
import { getTodosProjectIds } from "./dailyplans";
import { updateProjectOrder } from "./projects";

const allTodosDone = (todos: DailyPlanTodo[]) => (p: Project) =>
  flow(
    identity<DailyPlanTodo[]>,
    filter((t) => t.projectIds.includes(p.id)),
    every((t) => t.done || t.postPoned)
  )(todos)
    ? 1
    : 0;

export const useTodosProjects = (todos: DailyPlanTodo[]) => {
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();

  const projectIds = getTodosProjectIds(todos);

  return flow(
    identity<Project[] | undefined>,
    filter((p) => projectIds.includes(p.id)),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order),
    sortBy(allTodosDone(todos))
  )(projects);
};
