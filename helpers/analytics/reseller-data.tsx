import { Mrr } from "@/api/useMrr";
import {
  AccountMrr,
  MonthData,
  MonthMrr,
} from "@/components/analytics/table/analytics-table-column";
import { differenceInCalendarMonths } from "date-fns";
import {
  filter,
  flow,
  identity,
  map,
  reduce,
  sortBy,
  sum,
  takeRight,
  uniq,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";
import { addMonthsFp, formatDateYyyyMm, substract } from "../functional";
import { RevenueMonth } from "./account-data";
import {
  byAccount,
  byMonth,
  byPayerAccount,
  parseMonthToInt,
} from "./analytics";
import {
  getAccountId,
  getLastMonthMrrByAccount,
  getUniqMonths,
  takeNoOfMonths,
} from "./prep-table-data";

export const setResellerColumnDataFromMrr = (
  resellerId: string | undefined,
  mrr: Mrr[] | undefined,
  noOfMonths: number,
  setColumnData: Dispatch<SetStateAction<AccountMrr[]>>
) =>
  !mrr
    ? []
    : !resellerId
      ? []
      : flow(
          identity<Mrr[]>,
          filter(byReseller(resellerId)),
          map("companyName"),
          uniq,
          map(mapCompanyMrrData(resellerId, mrr, noOfMonths)),
          sortBy(getLastMonthMrrByAccount(mrr)),
          setColumnData
        )(mrr);

export const setLastMonthsResellerRevenue = (
  resellerId: string | undefined,
  noOfMonths: number,
  mrr: Mrr[] | undefined,
  setRevenue: Dispatch<SetStateAction<RevenueMonth[]>>
) =>
  !mrr
    ? []
    : !resellerId
      ? []
      : flow(
          identity<Mrr[]>,
          filter(byReseller(resellerId)),
          getUniqMonths,
          sortBy(parseMonthToInt),
          takeRight(noOfMonths),
          map(getMonthResellerRevenue(resellerId, mrr)),
          setRevenue
        )(mrr);

const byReseller = (resellerId: string) => (mrr: Mrr) =>
  resellerId === mrr.resellerId;

const getMonthResellerRevenue =
  (resellerId: string, mrr: Mrr[]) =>
  (month: string): RevenueMonth =>
    flow(
      identity<Mrr[]>,
      filter(byReseller(resellerId)),
      filter(byMonth(month)),
      map("mrr"),
      sum,
      (mrrTotal) => ({ month: new Date(`${month}-01`), mrr: mrrTotal })
    )(mrr);

const mapCompanyMrrData =
  (resellerId: string, mrr: Mrr[], noOfMonths: number) =>
  (account: string): AccountMrr => ({
    id: getAccountId(mrr, account),
    accountOrPayer: account,
    isReseller: false,
    ...getMrrMonths(resellerId, mrr, account, undefined, noOfMonths),
    children: [],
  });

const getMrrMonths = (
  resellerId: string,
  mrr: Mrr[],
  account: string,
  payer: string | undefined,
  noOfMonths: number
): MonthData =>
  flow(
    takeNoOfMonths(noOfMonths),
    reduce(
      getMrrMonthValue(resellerId, mrr, account, payer, noOfMonths),
      {} as MonthData
    )
  )(mrr);

const getMrrMonthValue =
  (
    resellerId: string,
    mrr: Mrr[],
    account: string,
    payer: string | undefined,
    noOfMonths: number
  ) =>
  (monthlyMrr: MonthData, month: string): MonthData =>
    flow(getTotalMrr(resellerId, account, payer, month), (mrrTotal) => ({
      ...monthlyMrr,
      [getMonthIdentifier(mrr, month, noOfMonths)]: {
        currentMonth: mrrTotal,
        lastMonth: getPrevPeriodValue(
          resellerId,
          mrr,
          account,
          payer,
          month,
          -1
        ),
        lastPeriod: getPrevPeriodValue(
          resellerId,
          mrr,
          account,
          payer,
          month,
          -noOfMonths
        ),
        lastYear: getPrevPeriodValue(
          resellerId,
          mrr,
          account,
          payer,
          month,
          -12
        ),
      } as MonthMrr,
    }))(mrr);

const getTotalMrr =
  (
    resellerId: string,
    account: string | undefined,
    payer: string | undefined,
    month: string
  ) =>
  (mrr: Mrr[]) =>
    flow(
      identity<Mrr[]>,
      filter(byReseller(resellerId)),
      filter(byAccount(account)),
      filter(byPayerAccount(payer)),
      filter(byMonth(month)),
      map("mrr"),
      sum
    )(mrr);

const getPrevPeriodValue = (
  resellerId: string,
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
    (prvMonth: string) => getTotalMrr(resellerId, account, payer, prvMonth)(mrr)
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
