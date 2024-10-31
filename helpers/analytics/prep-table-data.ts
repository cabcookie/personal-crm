import { Mrr } from "@/api/useMrr";
import {
  AccountMrr,
  getColumnDef,
  MonthData,
  MonthMrr,
} from "@/components/analytics/analytics-table-column";
import {
  addMonthsFp,
  formatDateYyyyMm,
  invertSign,
  substract,
} from "@/helpers/functional";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarMonths } from "date-fns";
import {
  compact,
  filter,
  flatMap,
  flow,
  get,
  identity,
  last,
  map,
  reduce,
  size,
  some,
  sortBy,
  sum,
  takeRight,
  uniq,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";
import {
  byAccount,
  byMonth,
  byPayerAccount,
  parseMonthToInt,
} from "./analytics";

export const setColumnDataFromMrr = (
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnData: Dispatch<SetStateAction<AccountMrr[]>>
) =>
  !mrr
    ? []
    : flow(
        identity<Mrr[]>,
        map("companyName"),
        uniq,
        map(mapCompanyMrrData(mrr, noOfMonths)),
        sortBy(getLastMonthMrrByAccount(mrr)),
        setColumnData
      )(mrr);

export const setColumnDefFromMrr = (
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnDef: Dispatch<SetStateAction<ColumnDef<AccountMrr>[]>>
) =>
  !mrr ? [] : flow(identity<number>, getColumnDef, setColumnDef)(noOfMonths);

export const getNoOfMonths = (mrr: Mrr[] | undefined) =>
  flow(identity<Mrr[] | undefined>, getUniqMonths, size)(mrr);

const mapCompanyMrrData =
  (mrr: Mrr[], noOfMonths: number) =>
  (account: string): AccountMrr => ({
    id: getAccountId(mrr, account),
    accountOrPayer: account,
    isReseller: false,
    ...getMrrMonths(mrr, account, undefined, noOfMonths),
    children: getPayerMrrDataByAccount(mrr, account, noOfMonths),
  });

const filterMrrByMonths = (mrr: Mrr[]) => (months: string[]) =>
  flow(
    identity<Mrr[]>,
    filter((mrr) => months.includes(mrr.month))
  )(mrr);

const getResellerState = (
  mrr: Mrr[],
  account: string,
  payer: string,
  noOfMonths: number
) =>
  flow(
    takeNoOfMonths(noOfMonths),
    filterMrrByMonths(mrr),
    filter(byAccount(account)),
    filter(byPayerAccount(payer)),
    some((mrr) => mrr.isReseller)
  )(mrr);

const mapPayerMrrData =
  (mrr: Mrr[], account: string, noOfMonths: number) =>
  (payer: string): AccountMrr => ({
    id: payer,
    accountOrPayer: payer,
    isReseller: getResellerState(mrr, account, payer, noOfMonths),
    ...getMrrMonths(mrr, account, payer, noOfMonths),
    children: [],
  });

const takeNoOfMonths = (noOfMonths: number) =>
  flow(
    identity<Mrr[]>,
    getUniqMonths,
    sortBy(parseMonthToInt),
    takeRight(noOfMonths)
  );

const getMrrMonths = (
  mrr: Mrr[],
  account: string,
  payer: string | undefined,
  noOfMonths: number
): MonthData =>
  flow(
    takeNoOfMonths(noOfMonths),
    reduce(getMrrMonthValue(mrr, account, payer, noOfMonths), {} as MonthData)
  )(mrr);

const getTotalMrr =
  (account: string | undefined, payer: string | undefined, month: string) =>
  (mrr: Mrr[]) =>
    flow(
      identity<Mrr[]>,
      filter(byAccount(account)),
      filter(byPayerAccount(payer)),
      filter(byMonth(month)),
      map("mrr"),
      sum
    )(mrr);

const getLastMonthMrr = (
  mrr: Mrr[],
  account: string,
  payer: string | undefined
) => flow(getTotalMrr(account, payer, getLastMonth(mrr)), invertSign)(mrr);

const getLastMonthMrrByAccount =
  (mrr: Mrr[]) =>
  ({ accountOrPayer }: AccountMrr) =>
    getLastMonthMrr(mrr, accountOrPayer, undefined);

const getLastMonthMrrByAccountAndPayer =
  (mrr: Mrr[], account: string) =>
  ({ accountOrPayer }: AccountMrr) =>
    getLastMonthMrr(mrr, account, accountOrPayer);

const getPayerMrrDataByAccount = (
  mrr: Mrr[],
  account: string,
  noOfMonths: number
): AccountMrr[] =>
  flow(
    identity<Mrr[]>,
    filter(byAccount(account)),
    map("awsAccountNumber"),
    uniq,
    map(mapPayerMrrData(mrr, account, noOfMonths)),
    sortBy(getLastMonthMrrByAccountAndPayer(mrr, account))
  )(mrr);

const getAccountId = (mrr: Mrr[], account: string): string =>
  flow(
    identity<Mrr[]>,
    filter(({ companyName }) => companyName === account),
    flatMap("payerAccountAccountIds"),
    compact,
    get(0)
  )(mrr) ?? "";

const getMrrMonthValue =
  (
    mrr: Mrr[],
    account: string,
    payer: string | undefined,
    noOfMonths: number
  ) =>
  (monthlyMrr: MonthData, month: string): MonthData =>
    flow(getTotalMrr(account, payer, month), (mrrTotal) => ({
      ...monthlyMrr,
      [getMonthIdentifier(mrr, month, noOfMonths)]: {
        currentMonth: mrrTotal,
        lastMonth: getPrevPeriodValue(mrr, account, payer, month, -1),
        lastPeriod: getPrevPeriodValue(mrr, account, payer, month, -noOfMonths),
        lastYear: getPrevPeriodValue(mrr, account, payer, month, -12),
      } as MonthMrr,
    }))(mrr);

const getPrevPeriodValue = (
  mrr: Mrr[],
  account: string,
  payer: string | undefined,
  month: string,
  diffMonths: number
) =>
  flow(
    identity<number>,
    addMonthsFp(new Date(`${month}-01`)),
    formatDateYyyyMm,
    (prvMonth: string) => getTotalMrr(account, payer, prvMonth)(mrr)
  )(diffMonths);

const getMonthIdentifier = (mrr: Mrr[], month: string, noOfMonths: number) =>
  flow(
    identity<number>,
    substract(diffInCalMonths(month)),
    substract(1),
    (id) => `month${id}Mrr`
  )(noOfMonths);

const diffInCalMonths = (month: string) =>
  differenceInCalendarMonths(new Date(), `${month}-01`);

const getLastMonth = (mrr: Mrr[]) =>
  flow(identity<Mrr[]>, getUniqMonths, sortBy(parseMonthToInt), last)(mrr) ??
  "";

const getUniqMonths = (mrr: Mrr[] | undefined) =>
  flow(identity<Mrr[] | undefined>, map("month"), uniq)(mrr);
