import { Mrr } from "@/api/useMrr";
import {
  AccountMrr,
  getMonthName,
  MonthMrr,
} from "@/components/analytics/analytics-table-column";
import RenderMonthMrr from "@/components/analytics/render-month-mrr";
import RenderPayerHeader from "@/components/analytics/render-payer-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  filter,
  flow,
  identity,
  map,
  sortBy,
  sum,
  takeRight,
  times,
  uniq,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";
import { byAccount, byMonth, parseMonthToInt } from "./analytics";
import {
  getLastMonthMrrByAccountAndPayer,
  getUniqMonths,
  mapPayerMrrData,
} from "./prep-table-data";

export type RevenueMonth = {
  month: Date;
  mrr: number;
};

export const setAccountColumnDataFromMrr = (
  account: string,
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnData: Dispatch<SetStateAction<AccountMrr[]>>
) =>
  !mrr
    ? []
    : flow(
        identity<Mrr[]>,
        filter(byAccount(account)),
        map("awsAccountNumber"),
        uniq,
        map(mapPayerMrrData(mrr, account, noOfMonths)),
        sortBy(getLastMonthMrrByAccountAndPayer(mrr, account)),
        setColumnData
      )(mrr);

export const setAccountColumnDefFromMrr = (
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnDef: Dispatch<SetStateAction<ColumnDef<AccountMrr>[]>>
) =>
  !mrr ? [] : flow(identity<number>, getColumnDef, setColumnDef)(noOfMonths);

export const setLastMonthsRevenue = (
  noOfMonths: number,
  account: string,
  mrr: Mrr[] | undefined,
  setRevenue: Dispatch<SetStateAction<RevenueMonth[]>>
) =>
  !mrr
    ? []
    : flow(
        identity<Mrr[]>,
        getUniqMonths,
        sortBy(parseMonthToInt),
        takeRight(noOfMonths),
        map(getMonthAccountRevenue(account, mrr)),
        setRevenue
      )(mrr);

export const setTotalRevenueFromRevenueMonth = (
  revenueLastMonths: RevenueMonth[],
  setTotalRevenue: Dispatch<SetStateAction<number>>
) =>
  flow(
    identity<RevenueMonth[]>,
    map("mrr"),
    sum,
    setTotalRevenue
  )(revenueLastMonths);

const getColumnDef = (noOfMonths: number): ColumnDef<AccountMrr>[] => [
  { accessorKey: "id" },
  { accessorKey: "isReseller" },
  {
    accessorKey: "accountOrPayer",
    header: "Payer",
    cell: ({ row, getValue }) => (
      <RenderPayerHeader
        id={row.getValue("id")}
        label={getValue<string>()}
        isReseller={row.getValue("isReseller")}
      />
    ),
  },
  ...getMonthlyMrrColumnDef(noOfMonths),
];

const getMonthAccountRevenue =
  (account: string, mrr: Mrr[]) =>
  (month: string): RevenueMonth =>
    flow(
      identity<Mrr[]>,
      filter(byAccount(account)),
      filter(byMonth(month)),
      map("mrr"),
      sum,
      (mrrTotal) => ({ month: new Date(`${month}-01`), mrr: mrrTotal })
    )(mrr);

const getMonthlyMrrColumnDef = (noOfMonths: number): ColumnDef<AccountMrr>[] =>
  flow(
    identity<number>,
    times(identity),
    map(
      (id: number): ColumnDef<AccountMrr> => ({
        accessorKey: `month${id}Mrr`,
        header: getMonthName(noOfMonths, id),
        cell: ({ getValue }) => (
          <RenderMonthMrr
            monthMrr={getValue<MonthMrr>()}
            noOfMonths={noOfMonths}
          />
        ),
      })
    )
  )(noOfMonths);
