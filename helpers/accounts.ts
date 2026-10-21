import {
  AccountBeforePipelineCalculations,
  AccountProjectData,
  SubsidiaryData,
  TerritoryData,
} from "@/api/ContextAccounts";
import { differenceInDays } from "date-fns";
import { filter, find, flow, map, sortBy, sum } from "lodash/fp";
import { calcPipeline } from "./projects";

type ResponsibilityData =
  TerritoryData["territory"]["responsibilities"][number];

/**
 * Typed max over numbers. lodash/fp's `max` is typed to return `{}` (its
 * declarations can't thread the element type through a point-free chain),
 * which leaked a non-`number` type all the way into Account.latestQuota — so
 * use a small, correctly-typed helper instead. Returns 0 for an empty list.
 */
const maxNum = (values: number[]): number =>
  values.length ? Math.max(...values) : 0;

const getLatestQuota = (territories: TerritoryData[]): number =>
  maxNum(
    territories.map((t: TerritoryData): number =>
      flow(
        sortBy((r: ResponsibilityData) => -new Date(r.startDate).getTime()),
        find(
          (r: ResponsibilityData) =>
            differenceInDays(new Date(), new Date(r.startDate)) > 0
        ),
        // Point-free `get("quota")` degrades to `{}` here (lodash/fp can't
        // thread the element type through). A typed accessor keeps it
        // `number` (and `?? 0` correctly keeps a real quota of 0).
        (r: ResponsibilityData | undefined): number => r?.quota ?? 0
      )(t.territory.responsibilities)
    )
  );

export const getQuotaFromTerritoryOrSubsidaries = (
  territories: TerritoryData[],
  subsidiaries: SubsidiaryData[]
): number =>
  maxNum([
    getLatestQuota(territories),
    maxNum(
      subsidiaries.map((s: SubsidiaryData): number =>
        getLatestQuota(s.territories)
      )
    ),
  ]);

export const calcOrder = (quota: number, pipeline: number): number =>
  sum([Math.floor(pipeline / 1000) * 1000, Math.floor(quota / 1000)]);

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
