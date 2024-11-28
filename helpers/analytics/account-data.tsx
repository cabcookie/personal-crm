import { Account } from "@/api/ContextAccounts";
import { Mrr } from "@/api/useMrr";
import { Payer } from "@/api/usePayer";
import {
  AccountMrr,
  getMonthName,
  MonthMrr,
} from "@/components/analytics/table/analytics-table-column";
import RenderAccountHeader from "@/components/analytics/table/render-account-header";
import RenderMonthMrr from "@/components/analytics/table/render-month-mrr";
import RenderPayerHeader from "@/components/analytics/table/render-payer-header";
import { ColumnDef } from "@tanstack/react-table";
import {
  filter,
  find,
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
import {
  byAccount,
  byMonth,
  byPayerAccount,
  parseMonthToInt,
} from "./analytics";
import {
  getAccountId,
  getLastMonthMrr,
  getLastMonthMrrByAccountAndPayer,
  getMrrMonths,
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

export const setPayerColumnDataFromMrr = (
  payer: string,
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnData: Dispatch<SetStateAction<AccountMrr[]>>
) =>
  !mrr
    ? []
    : flow(
        identity<Mrr[]>,
        filter(byPayerAccount(payer)),
        map("companyName"),
        uniq,
        map(mapCompanyMrrData(mrr, payer, noOfMonths)),
        sortBy(getLastMonthMrrByPayer(mrr, payer)),
        setColumnData
      )(mrr);

export const setAccountColumnDefFromMrr = (
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnDef: Dispatch<SetStateAction<ColumnDef<AccountMrr>[]>>
) =>
  !mrr
    ? []
    : flow(identity<number>, getAccountColumnDef, setColumnDef)(noOfMonths);

export const setPayerColumnDefFromMrr = (
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnDef: Dispatch<SetStateAction<ColumnDef<AccountMrr>[]>>
) =>
  !mrr
    ? []
    : flow(identity<number>, getPayerColumnDef, setColumnDef)(noOfMonths);

export const setLastMonthsAccountRevenue = (
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

export const setLastMonthsPayerRevenue = (
  noOfMonths: number,
  payer: string,
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
        map(getMonthPayerRevenue(payer, mrr)),
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

export const setResellerByPayer = (
  payer: Payer | undefined,
  accounts: Account[] | undefined,
  setReseller: Dispatch<SetStateAction<Account | undefined>>
) =>
  flow(
    identity<Account[] | undefined>,
    find(["id", payer?.resellerId]),
    setReseller
  )(accounts);

const getLastMonthMrrByPayer =
  (mrr: Mrr[], payer: string) =>
  ({ accountOrPayer: account }: AccountMrr) =>
    getLastMonthMrr(mrr, account, payer);

const getAccountColumnDef = (noOfMonths: number): ColumnDef<AccountMrr>[] => [
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

const getPayerColumnDef = (noOfMonths: number): ColumnDef<AccountMrr>[] => [
  { accessorKey: "id" },
  { accessorKey: "isReseller" },
  {
    accessorKey: "accountOrPayer",
    header: "Account",
    cell: ({ row, getValue }) => (
      <RenderAccountHeader id={row.getValue("id")} label={getValue<string>()} />
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

const getMonthPayerRevenue =
  (payer: string, mrr: Mrr[]) =>
  (month: string): RevenueMonth =>
    flow(
      identity<Mrr[]>,
      filter(byPayerAccount(payer)),
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

const mapCompanyMrrData =
  (mrr: Mrr[], payer: string, noOfMonths: number) =>
  (account: string): AccountMrr => ({
    id: getAccountId(mrr, account),
    accountOrPayer: account,
    isReseller: false,
    ...getMrrMonths(mrr, account, payer, noOfMonths),
    children: [],
  });
