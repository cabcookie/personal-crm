import {
  AccountBeforePipelineCalculations,
  AccountProjectData,
  SubsidiaryData,
  TerritoryData,
} from "@/api/ContextAccounts";
import { differenceInDays } from "date-fns";
import { filter, find, flow, get, map, max, sortBy, sum } from "lodash/fp";
import { calcPipeline } from "./projects";

type ResponsibilityData =
  TerritoryData["territory"]["responsibilities"][number];

const getLatestQuota = (territories: TerritoryData[]) =>
  flow(
    map(
      (t: TerritoryData) =>
        flow(
          sortBy((r: ResponsibilityData) => -new Date(r.startDate).getTime()),
          find((r) => differenceInDays(new Date(), new Date(r.startDate)) > 0),
          get("quota")
        )(t.territory.responsibilities) || 0
    ),
    max
  )(territories);

export const getQuotaFromTerritoryOrSubsidaries = (
  territories: TerritoryData[],
  subsidiaries: SubsidiaryData[]
) =>
  max([
    getLatestQuota(territories),
    flow(
      map((s: SubsidiaryData) => getLatestQuota(s.territories)),
      max
    )(subsidiaries),
  ]) || 0;

export const calcOrder = (quota: number, pipeline: number): number =>
  sum([Math.floor(quota / 1000) * 1000, Math.floor(pipeline / 1000)]);

const calcSubsidariesPipeline = (
  controllerId: string | undefined,
  accounts: AccountBeforePipelineCalculations[]
): number =>
  !controllerId
    ? 0
    : flow(
        filter(
          (a: AccountBeforePipelineCalculations) =>
            a.controller?.id === controllerId
        ),
        map(
          (a) =>
            calcPipeline(a.projects) + calcSubsidariesPipeline(a.id, accounts)
        ),
        sum
      )(accounts);

export const calcAccountAndSubsidariesPipeline = (
  accounts: AccountBeforePipelineCalculations[],
  accountId: string,
  projects: AccountProjectData[]
): number =>
  calcPipeline(projects) + calcSubsidariesPipeline(accountId, accounts);
