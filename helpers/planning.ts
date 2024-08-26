import { Account } from "@/api/ContextAccounts";
import { Project } from "@/api/ContextProjects";
import { WeeklyPlan } from "@/api/useWeekPlan";
import { updateProjectOrder } from "@/helpers/projects";
import { differenceInCalendarDays } from "date-fns";
import { filter, flow, map, sortBy } from "lodash/fp";

export const projectFilters = ["Open", "In Focus", "On Hold"] as const;
export type ProjectFilters = (typeof projectFilters)[number];

export const filterAndSortProjectsForWeeklyPlanning = (
  accounts: Account[] | undefined,
  startDate: Date,
  weekPlan: WeeklyPlan | undefined,
  projectFilter: ProjectFilters
) =>
  flow(
    filter((p: Project) => !p.done),
    filter((p): boolean =>
      projectFilter === "Open"
        ? !weekPlan?.projectIds.includes(p.id) &&
          (!p.onHoldTill ||
            differenceInCalendarDays(p.onHoldTill, startDate) < 7)
        : projectFilter === "On Hold"
        ? !weekPlan?.projectIds.includes(p.id) &&
          !!p.onHoldTill &&
          differenceInCalendarDays(p.onHoldTill, startDate) >= 7
        : !!weekPlan?.projectIds.includes(p.id) &&
          (!p.onHoldTill ||
            differenceInCalendarDays(p.onHoldTill, startDate) < 7)
    ),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order)
  );

export const filterAndSortProjectsForDailyPlanning = (
  accounts: Account[] | undefined,
  planDate: Date
) =>
  flow(
    filter(
      (p: Project) =>
        !p.done &&
        (!p.onHoldTill || differenceInCalendarDays(p.onHoldTill, planDate) <= 0)
    ),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order)
  );
