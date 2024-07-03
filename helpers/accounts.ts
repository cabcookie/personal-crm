import { AccountData } from "@/api/ContextAccounts";
import { differenceInDays } from "date-fns";
import { find, flow, get, map, max, sortBy, sum } from "lodash/fp";

type TerritoryData = AccountData["territories"][number];
type SubsidiaryData = AccountData["subsidiaries"][number];
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
    sum
  )(territories);

export const getQuotaFromTerritoryOrSubsidaries = (
  territories: TerritoryData[],
  subsidiaries: SubsidiaryData[]
) =>
  max([
    getLatestQuota(territories),
    flow(
      map((s: SubsidiaryData) => getLatestQuota(s.territories)),
      sum
    )(subsidiaries),
  ]) || 0;

export const calcOrder = (quota: number, pipeline: number): number =>
  sum([Math.floor(quota / 1000) * 1000, Math.floor(pipeline / 1000)]);