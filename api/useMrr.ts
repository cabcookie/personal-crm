import { type Schema } from "@/amplify/data/resource";
import { MrrImportData } from "@/api/useMrrImport";
import { MrrFilters } from "@/components/analytics/useMrrFilter";
import { getMinMonth, mapPayerMrrs } from "@/helpers/analytics/analytics";
import {
  DoneMonthMrrData,
  getMonthMrr,
  getMonths,
} from "@/helpers/analytics/api-actions";
import { SelectionSet } from "aws-amplify/data";
import { flatMap, flow, get, identity } from "lodash/fp";
import useSWR, { KeyedMutator } from "swr";
import { handleApiErrors } from "./globals";
import { client } from "@/lib/amplify";

const wipSelectionSet = [
  "latestMonths.month",
  "latestMonths.payerMrrs.id",
  "latestMonths.payerMrrs.companyName",
  "latestMonths.payerMrrs.awsAccountNumber",
  "latestMonths.payerMrrs.payerAccount.accounts.accountId",
  "latestMonths.payerMrrs.payerAccount.resellerId",
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
  payerAccountAccountIds?: string[];
  isEstimated: boolean;
  isReseller: boolean;
  resellerId?: string;
  mrr: number;
  lastYearMrr?: number;
  lastPeriodMrr?: number;
};

const mapMrr = ({
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
      flatMap(mapMrr)
    )(data);
  } catch (error) {
    console.error("fetchMrr", error);
    throw error;
  }
};

const fetchMrrDone = (noOfMonths?: MrrFilters) => async () => {
  if (!noOfMonths) return;
  const noOfMonthsInt = parseInt(noOfMonths);
  const startMonth = getMinMonth(noOfMonthsInt);
  const months = await getMonths(startMonth);
  if (!months) return;
  const data = await Promise.all(months.map(getMonthMrr));
  return flow(identity<DoneMonthMrrData[]>, flatMap(mapMrr))(data);
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
    mutate,
  } = useSWR(`/api/mrr/${status}/${noOfMonths}`, fetchMrr(status, noOfMonths));

  return { mrr, isLoading, error, mutate };
};

export type MrrMutator = KeyedMutator<Mrr[] | undefined>;

export default useMrr;
