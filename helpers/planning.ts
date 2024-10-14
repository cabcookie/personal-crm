import { Account } from "@/api/ContextAccounts";
import { Project } from "@/api/ContextProjects";
import { WeeklyPlan } from "@/api/useWeekPlan";
import { calcOrder } from "@/helpers/accounts";
import { calcRevenueTwoYears, updateProjectOrder } from "@/helpers/projects";
import { differenceInCalendarDays } from "date-fns";
import {
  compact,
  filter,
  flatMap,
  flow,
  identity,
  map,
  size,
  sortBy,
  sum,
} from "lodash/fp";

export type AccountProjects = Account & { projects: Project[] };

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

export const setProjectsFilterCount = (
  projects: Project[] | undefined,
  accounts: Account[] | undefined,
  startDate: Date,
  weekPlan: WeeklyPlan | undefined,
  setOpenCount: (count: number) => void,
  setFocusCount: (count: number) => void,
  setOnholdCount: (count: number) => void
) => {
  const simplifiedFilterFn = (projectFilter: ProjectFilters) =>
    filterAndSortProjectsForWeeklyPlanning(
      accounts,
      startDate,
      weekPlan,
      projectFilter
    );
  flow(simplifiedFilterFn("Open"), size, setOpenCount)(projects);
  flow(simplifiedFilterFn("On Hold"), size, setOnholdCount)(projects);
  flow(simplifiedFilterFn("In Focus"), size, setFocusCount)(projects);
};

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

export const mapAccountProjects =
  (projects: Project[] | undefined) => (account: Account) => ({
    ...account,
    projects: projects?.filter((p) => p.accountIds.includes(account.id)) ?? [],
  });

const calcPipeline: (projects: Project[]) => number = flow(
  identity<Project[]>,
  flatMap("crmProjects"),
  compact,
  map(calcRevenueTwoYears),
  sum,
  (val: number | undefined) => val ?? 0,
  Math.floor
);

const reCalculateOrder = ({ latestQuota, projects }: AccountProjects) =>
  calcOrder(latestQuota, calcPipeline(projects));

export const mapAccountOrder = (account: AccountProjects): AccountProjects => ({
  ...account,
  order: reCalculateOrder(account),
  pipeline: calcPipeline(account.projects),
});

export const isSelectedForWeek = (weekPlan: WeeklyPlan, project: Project) =>
  weekPlan.projectIds.some((id) => id === project.id);

export const isDeselectedForWeek = (weekPlan: WeeklyPlan, project: Project) =>
  !!project.onHoldTill &&
  differenceInCalendarDays(project.onHoldTill, weekPlan.startDate) >= 7;
