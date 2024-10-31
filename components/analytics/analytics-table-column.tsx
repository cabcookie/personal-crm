import {
  addMonthsFp,
  formatDate,
  invertSign,
  substract,
} from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { flow, identity, map, times } from "lodash/fp";
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

export const getColumnDef = (noOfMonths: number): ColumnDef<AccountMrr>[] => [
  { accessorKey: "id" },
  { accessorKey: "isReseller" },
  {
    accessorKey: "accountOrPayer",
    header: "Account/Payer",
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
  ...getMonthlyMrrColumnDef(noOfMonths),
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
