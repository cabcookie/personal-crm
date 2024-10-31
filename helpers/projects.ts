import { Account } from "@/api/ContextAccounts";
import { CrmDataProps, Project } from "@/api/ContextProjects";
import { STAGES_PROBABILITY, TCrmStages } from "@/api/useCrmProject";
import { ProjectFilters } from "@/components/projects/useProjectFilter";
import { differenceInCalendarMonths } from "date-fns";
import { filter, flatMap, flow, map, max, round, sortBy, sum } from "lodash/fp";
import { calcOrder } from "./accounts";
import { formatRevenue } from "./functional";

interface CalcPipelineProps {
  projects: ProjectProps;
}

export interface CalcPipelineFields {
  crmProject: {
    annualRecurringRevenue: CrmDataProps["crmProject"]["annualRecurringRevenue"];
    totalContractVolume: CrmDataProps["crmProject"]["totalContractVolume"];
    closeDate: CrmDataProps["crmProject"]["closeDate"];
    isMarketplace: CrmDataProps["crmProject"]["isMarketplace"];
    stage: CrmDataProps["crmProject"]["stage"];
  } | null;
}

interface ProjectProps {
  done?: boolean | null;
  crmProjects: CalcPipelineFields[];
}

interface ICalcRevenueTwoYears {
  arr: number;
  tcv: number;
  closeDate: Date;
  isMarketPlace?: boolean;
  stage: TCrmStages;
}

export const mapPipelineFields = ({
  crmProject,
}: CalcPipelineFields): ICalcRevenueTwoYears => ({
  arr: crmProject?.annualRecurringRevenue ?? 0,
  tcv: crmProject?.totalContractVolume ?? 0,
  closeDate: !crmProject ? new Date() : new Date(crmProject.closeDate),
  stage: !crmProject ? "Prospect" : (crmProject.stage as TCrmStages),
  isMarketPlace: crmProject?.isMarketplace ?? false,
});

const calcProjectOrder =
  (pipeline: number) => (accountQuota: number | undefined) =>
    calcOrder(accountQuota || 0, pipeline);

const maxOfArray = (val: number[]): number => max(val) || 0;

const getProbability = (stage: string): number =>
  (STAGES_PROBABILITY.find((s) => s.stage === stage)?.probability || 0) / 100;

export const calcRevenueTwoYears = (crmProject: ICalcRevenueTwoYears) =>
  flow(
    ({
      arr,
      tcv,
      closeDate,
      isMarketPlace,
      stage,
    }: ICalcRevenueTwoYears): number[] => [
      (arr / 12) *
        (24 - differenceInCalendarMonths(closeDate, new Date())) *
        getProbability(stage),
      (tcv / (isMarketPlace ? 2 : 1)) * getProbability(stage),
    ],
    maxOfArray,
    round
  )(crmProject);

export const calcPipeline = (projects: CalcPipelineProps[]): number =>
  flow(
    map("projects"),
    filter((p: ProjectProps) => !p?.done),
    map("crmProjects"),
    flatMap(map(mapPipelineFields)),
    filter((d) => !!d),
    map(calcRevenueTwoYears),
    sum,
    (val: number | undefined) => val || 0,
    Math.floor
  )(projects);

export const updateProjectOrder =
  (accounts: Account[] | undefined) =>
  (project: Project): Project => ({
    ...project,
    order: flow(
      filter((a: Account) => project.accountIds.includes(a.id)),
      map("latestQuota"),
      max,
      calcProjectOrder(project.pipeline)
    )(accounts),
  });

export const make2YearsRevenueText = (revenue: number) =>
  revenue === 0 ? "" : `Pipeline 2Ys: ${formatRevenue(revenue)}`;

export const getRevenue2Years = (projects: ICalcRevenueTwoYears[]) =>
  make2YearsRevenueText(flow(map(calcRevenueTwoYears), sum)(projects));

type FilterAndSortProjectsProps = {
  projects: Project[];
  accountId?: string;
  projectFilter?: ProjectFilters;
  accounts?: Account[];
  searchText?: string;
};

type FilterProjectsProps = Pick<
  FilterAndSortProjectsProps,
  "accountId" | "projectFilter" | "searchText"
>;

const searchTextInProjectName = (
  projectName: string,
  searchText: FilterProjectsProps["searchText"]
) =>
  searchText
    ? projectName.toLowerCase().includes(searchText.toLowerCase())
    : true;

const filterByProjectStatus =
  ({ accountId, projectFilter }: FilterProjectsProps) =>
  ({ accountIds, done, onHoldTill }: Project) =>
    accountId
      ? accountIds.includes(accountId) && !done
      : (projectFilter === "WIP" && !done && !onHoldTill) ||
        (projectFilter === "On Hold" && !done && !!onHoldTill) ||
        (projectFilter === "Done" && done);

const filterBySearch =
  ({ accountId, searchText }: FilterProjectsProps) =>
  ({ accountIds, done, project }: Project) =>
    accountId
      ? accountIds.includes(accountId) &&
        searchTextInProjectName(project, searchText) &&
        !done
      : searchTextInProjectName(project, searchText) && !done;

export const calcPipelineByAccountId =
  (accountId: string | undefined) =>
  (projects?: Project[]): number =>
    !projects
      ? 0
      : flow(
          filter(filterByProjectStatus({ accountId })),
          map((p) => p.pipeline),
          sum
        )(projects);

export const filterAndSortProjects = ({
  projectFilter,
  accountId,
  projects,
  accounts,
  searchText,
}: FilterAndSortProjectsProps) => {
  const filterProjects = searchText ? filterBySearch : filterByProjectStatus;

  return flow(
    filter(filterProjects({ accountId, projectFilter, searchText })),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order)
  )(projects);
};
