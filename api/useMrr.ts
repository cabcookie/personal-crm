import { type Schema } from "@/amplify/data/resource";
import { MrrImportData } from "@/api/useMrrImport";
import { MrrFilters } from "@/components/analytics/useMrrFilter";
import {
  getMinMonth,
  mapPayerMrrs,
  sortByMonth,
} from "@/helpers/analytics/analytics";
import {
  DoneMonthMrrData,
  getMonthMrr,
  getMonths,
} from "@/helpers/analytics/api-actions";
import { logFp } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { flatMap, flow, get, identity, map } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const wipSelectionSet = [
  "latestMonths.month",
  "latestMonths.payerMrrs.id",
  "latestMonths.payerMrrs.companyName",
  "latestMonths.payerMrrs.awsAccountNumber",
  "latestMonths.payerMrrs.payerAccount.accountId",
  "latestMonths.payerMrrs.isEstimated",
  "latestMonths.payerMrrs.isReseller",
  "latestMonths.payerMrrs.mrr",
] as const;

export type MrrWipData = SelectionSet<
  Schema["MrrDataUpload"]["type"],
  typeof wipSelectionSet
>;

export type Mrr = {
  id: string;
  month: string;
  companyName: string;
  awsAccountNumber: string;
  payerAccountAccountId?: string;
  isEstimated: boolean;
  isReseller: boolean;
  mrr: number;
  lastYearMrr?: number;
  lastPeriodMrr?: number;
};

const mapWipMrr = ({
  month,
  payerMrrs,
}: MrrWipData["latestMonths"][number]): Mrr[] =>
  payerMrrs.map(mapPayerMrrs(month));

const fetchMrrWip = async () => {
  const { data, errors } =
    await client.models.MrrDataUpload.listMrrDataUploadByStatusAndCreatedAt(
      { status: "WIP" },
      {
        sortDirection: "DESC",
        limit: 1,
        selectionSet: wipSelectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Loading Mrr (WIP) failed");
    throw errors;
  }
  try {
    return flow(
      identity<MrrWipData[] | undefined>,
      get(0),
      get("latestMonths"),
      flatMap(mapWipMrr)
    )(data);
  } catch (error) {
    console.error("fetchMrr", error);
    throw error;
  }
};

const comparePeriods = (
  noOfMonths: number,
  months: MrrWipData["latestMonths"][]
) => {
  console.log("comparePeriods", months);
};

export type DoneMonthData = {
  month: string;
  payerMrrs: DoneMonthMrrData[];
};

type MonthPayerMrrs = {};

const mapDoneMrr = ({ month, payerMrrs }: DoneMonthData) => ({
  month,
  payerMrrs: payerMrrs.map(({ payerAccount, ...rest }) => ({
    ...rest,
    payerAccountAccountId: payerAccount.accountId,
  })),
});

const fetchMrrDone = (noOfMonths?: MrrFilters) => async () => {
  if (!noOfMonths) return;
  const noOfMonthsInt = parseInt(noOfMonths);
  const startMonth = getMinMonth(noOfMonthsInt);
  const months = await getMonths(startMonth);
  if (!months) return;
  const data = await Promise.all(months.map(getMonthMrr));
  const orderedMonths = flow(
    map(mapDoneMrr),
    sortByMonth,
    logFp("fetchMrrDone")
  )(data);

  return flow(flatMap(mapWipMrr))(orderedMonths);
};

const fetchMrr =
  (status: MrrImportData["status"], noOfMonths?: MrrFilters) => async () => {
    const fetcher = status === "WIP" ? fetchMrrWip : fetchMrrDone(noOfMonths);
    const data = await fetcher();
    return data;
  };

const useMrr = (status: MrrImportData["status"], noOfMonths?: MrrFilters) => {
  const {
    data: mrr,
    isLoading,
    error,
  } = useSWR(`/api/mrr/${status}/${noOfMonths}`, fetchMrr(status, noOfMonths));

  return { mrr, isLoading, error };
};

export default useMrr;
