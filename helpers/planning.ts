import { Account } from "@/api/ContextAccounts";
import { Project } from "@/api/ContextProjects";
import { DailyPlan } from "@/api/useDailyPlans";
import { WeeklyPlan } from "@/api/useWeekPlan";
import { calcOrder } from "@/helpers/accounts";
import { calcRevenueTwoYears, updateProjectOrder } from "@/helpers/projects";
import { differenceInCalendarDays } from "date-fns";
import {
  compact,
  filter,
  find,
  flatMap,
  flow,
  get,
  identity,
  map,
  size,
  some,
  sortBy,
  sum,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";

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
  projects: Project[] | undefined,
  accounts: Account[] | undefined,
  dailyPlan: DailyPlan,
  onDailyPlan: boolean,
  setList: Dispatch<SetStateAction<Project[] | undefined>>
) =>
  flow(
    filter(
      (p: Project) =>
        !p.done &&
        (!p.onHoldTill ||
          differenceInCalendarDays(p.onHoldTill, dailyPlan.day) <= 0) &&
        ((!dailyPlan.projects.some(({ projectId }) => p.id === projectId) &&
          !onDailyPlan) ||
          (dailyPlan.projects.some(({ projectId }) => p.id === projectId) &&
            onDailyPlan))
    ),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order),
    setList
  )(projects);

export const setProjectOnDayPlanCount = (
  dayPlan: DailyPlan,
  onList: boolean,
  projects: Project[],
  maybe: boolean,
  setProjectCount: Dispatch<SetStateAction<number>>
) =>
  flow(
    identity<Project[]>,
    filter((p) => (!onList ? !maybe : isOnDayplan(dayPlan, p, maybe))),
    size,
    setProjectCount
  )(projects);

export const mapAccountProjects =
  (projects: Project[] | undefined) => (account: Account) => ({
    ...account,
    projects: projects?.filter((p) => p.accountIds.includes(account.id)) ?? [],
  });

export const isOnDayplan = (
  dayPlan: DailyPlan,
  project: Project,
  maybe?: boolean
) =>
  flow(
    identity<DailyPlan>,
    get("projects"),
    some(
      (dp) =>
        dp.projectId === project.id &&
        (maybe === undefined || dp.maybe === maybe)
    )
  )(dayPlan);

export const setProjectMaybe = (
  dayPlan: DailyPlan | undefined,
  project: Project,
  setMaybe: Dispatch<SetStateAction<boolean | undefined>>
) =>
  flow(
    identity<DailyPlan | undefined>,
    get("projects"),
    find(["projectId", project.id]),
    get("maybe"),
    setMaybe
  )(dayPlan);

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
