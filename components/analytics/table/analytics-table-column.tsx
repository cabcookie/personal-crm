import { Mrr } from "@/api/useMrr";
import { byMonth } from "@/helpers/analytics/analytics";
import {
  addMonthsFp,
  formatDate,
  formatDateYyyyMm,
  invertSign,
  substract,
} from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { filter, flow, identity, map, sum, times } from "lodash/fp";
import RenderAccountHeader from "./render-account-header";
import RenderMonthMrr from "./render-month-mrr";
import RenderPayerHeader from "./render-payer-header";

export type MonthMrr = {
  currentMonth: number;
  lastYear: number;
  lastPeriod: number;
  lastMonth: number;
};

export type MonthData = {
  [key in `month${number}Mrr`]?: MonthMrr;
};

export type AccountMrr = {
  id: string;
  isReseller: boolean;
  accountOrPayer: string;
  children: AccountMrr[];
} & MonthData;

export const getColumnDef =
  (mrr: Mrr[]) =>
  (noOfMonths: number): ColumnDef<AccountMrr>[] => [
    { accessorKey: "id" },
    { accessorKey: "isReseller" },
    {
      accessorKey: "accountOrPayer",
      header: "Account/Payer",
      footer: "Total",
      cell: ({ row, getValue }) =>
        row.depth === 0 ? (
          <RenderAccountHeader
            id={row.getValue("id")}
            label={getValue<string>()}
          />
        ) : (
          <RenderPayerHeader
            id={row.getValue("id")}
            label={getValue<string>()}
            isReseller={row.getValue("isReseller")}
          />
        ),
    },
    ...getMonthlyMrrColumnDef(mrr, noOfMonths),
  ];

export const getMonthName = (noOfMonths: number, id: number) =>
  flow(
    identity<number>,
    substract(id),
    substract(1),
    invertSign,
    addMonthsFp(new Date()),
    formatDate("MMM yyyy")
  )(noOfMonths);

const getMonthMrr =
  (mrr: Mrr[], noOfMonths: number) =>
  (month: string): MonthMrr => ({
    currentMonth: getMonthPeriodTotal(mrr, month),
    lastYear: getMonthPeriodTotal(mrr, month, -12),
    lastPeriod: getMonthPeriodTotal(mrr, month, -noOfMonths),
    lastMonth: getMonthPeriodTotal(mrr, month, -1),
  });

const getTotalMrr =
  (mrr: Mrr[]) =>
  (month: string): number =>
    flow(filter(byMonth(month)), map("mrr"), sum)(mrr);

const getMonthPeriodTotal = (mrr: Mrr[], month: string, diffMonths = 0) =>
  flow(
    identity<number>,
    addMonthsFp(new Date(`${month}-01`)),
    formatDateYyyyMm,
    getTotalMrr(mrr)
  )(diffMonths);

const getMonthlyTotals = (
  mrr: Mrr[],
  noOfMonths: number,
  id: number
): MonthMrr =>
  flow(
    identity<number>,
    substract(id),
    substract(1),
    invertSign,
    addMonthsFp(new Date()),
    formatDateYyyyMm,
    getMonthMrr(mrr, noOfMonths)
  )(noOfMonths);

const getMonthlyMrrColumnDef = (
  mrr: Mrr[],
  noOfMonths: number
): ColumnDef<AccountMrr>[] =>
  flow(
    identity<number>,
    times(identity),
    map(
      (id: number): ColumnDef<AccountMrr> => ({
        accessorKey: `month${id}Mrr`,
        header: getMonthName(noOfMonths, id),
        footer: () => (
          <RenderMonthMrr
            monthMrr={getMonthlyTotals(mrr, noOfMonths, id)}
            noOfMonths={noOfMonths}
          />
        ),
        cell: ({ getValue }) => (
          <RenderMonthMrr
            monthMrr={getValue<MonthMrr>()}
            noOfMonths={noOfMonths}
          />
        ),
      })
    )
  )(noOfMonths);
