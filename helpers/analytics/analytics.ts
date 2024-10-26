import { Account } from "@/api/ContextAccounts";
import { Mrr, MrrWipData } from "@/api/useMrr";
import { MrrFilters } from "@/components/analytics/useMrrFilter";
import { formatDateYyyyMm, formatRevenue } from "@/helpers/functional";
import { addMonths } from "date-fns";
import {
  filter,
  find,
  flow,
  get,
  identity,
  join,
  last,
  map,
  orderBy,
  replace,
  size,
  some,
  sortBy,
  sum,
  uniq,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";

type PayerMrrsData = MrrWipData["latestMonths"][number]["payerMrrs"][number];

export type MrrDataIssue = {
  awsAccountNumber: string;
  companyName: string;
  linkedCompanyName: string;
};

const substractMonthsFp = (noOfMonths: number) =>
  addMonths(new Date(), -noOfMonths);

export const getMinMonth = flow(
  identity<MrrFilters>,
  parseInt,
  substractMonthsFp,
  formatDateYyyyMm
);

const parseMonthToInt = flow(identity<string>, replace("-", ""), parseInt);

export const mapPayerMrrs =
  (month: string) =>
  ({ payerAccount, mrr, ...rest }: PayerMrrsData): Mrr => ({
    month,
    mrr: mrr ?? 0,
    payerAccountAccountId: payerAccount?.accountId ?? undefined,
    ...rest,
  });

const byAccount =
  (account: string) =>
  ({ companyName }: Mrr) =>
    companyName === account;

const byPayerAccount =
  (payerAccount: string) =>
  ({ awsAccountNumber }: Mrr) =>
    awsAccountNumber === payerAccount;

const byMonth = (month: string) => (mrr: Mrr) => month === mrr.month;

const mrrByAccount = (mrr: Mrr[]) => (account: string) =>
  -(
    flow(identity<Mrr[]>, filter(byAccount(account)), map("mrr"), sum)(mrr) ?? 0
  );

const mrrByPayerAccount = (mrr: Mrr[]) => (payerAccount: string) =>
  -(
    flow(
      identity<Mrr[]>,
      filter(byPayerAccount(payerAccount)),
      map("mrr"),
      sum
    )(mrr) ?? 0
  );

export const setAccountsFromMrr = (
  mrr: Mrr[] | undefined,
  setAccounts: Dispatch<SetStateAction<string[]>>
) =>
  mrr &&
  flow(
    identity<Mrr[]>,
    map("companyName"),
    uniq,
    sortBy(mrrByAccount(mrr)),
    setAccounts
  )(mrr);

export const setAccountMrrByAccount = (
  account: string,
  mrr: Mrr[] | undefined,
  setAccounts: Dispatch<SetStateAction<Mrr[]>>
) => mrr && flow(identity<Mrr[]>, filter(byAccount(account)), setAccounts)(mrr);

export const setPayerAccountsFromMrr = (
  mrr: Mrr[] | undefined,
  setPayerAccounts: Dispatch<SetStateAction<string[]>>
) =>
  mrr &&
  flow(
    identity<Mrr[]>,
    map("awsAccountNumber"),
    uniq,
    sortBy(mrrByPayerAccount(mrr)),
    setPayerAccounts
  )(mrr);

export const setPayerAccountMrrByPayer = (
  payer: string,
  mrr: Mrr[],
  setAccounts: Dispatch<SetStateAction<Mrr[]>>
) => flow(identity<Mrr[]>, filter(byPayerAccount(payer)), setAccounts)(mrr);

export const setMonthsByPayer = (
  mrr: Mrr[] | undefined,
  setMonths: Dispatch<SetStateAction<string[]>>
) =>
  mrr &&
  flow(
    identity<Mrr[]>,
    map("month"),
    uniq,
    sortBy(parseMonthToInt),
    setMonths
  )(mrr);

export const setMonthMrrByMonth = (
  month: string,
  mrr: Mrr[],
  setMonthMrr: Dispatch<SetStateAction<Mrr | undefined>>
) => flow(identity<Mrr[]>, filter(byMonth(month)), get(0), setMonthMrr)(mrr);

const getMonthRevenueStr = (mrr: Mrr[]) => (lastMonth: string) =>
  `${lastMonth}: ${flow(
    identity<Mrr[]>,
    filter(byMonth(lastMonth)),
    map("mrr"),
    sum,
    formatRevenue
  )(mrr)}`;

const getLastMonth = flow(
  identity<Mrr[]>,
  map("month"),
  uniq,
  sortBy(parseMonthToInt),
  last
);

const countMonths = flow(identity<Mrr[]>, map("month"), uniq, size);

const getRevenueStr = (mrr: Mrr[]) => (totalMrr: number) =>
  totalMrr === 0
    ? "No data"
    : `Total: ${formatRevenue(totalMrr)}, Avg: ${formatRevenue(
        totalMrr / countMonths(mrr)
      )}, ${flow(getLastMonth, getMonthRevenueStr(mrr))(mrr)}`;

export const totalMrr = (mrr: Mrr[]) =>
  flow(identity<Mrr[]>, map("mrr"), sum, getRevenueStr(mrr))(mrr);

export const hasResellerItems = flow(identity<Mrr[]>, some("isReseller"));

const addCompanyNames =
  (mrr: Mrr[]) =>
  (awsAccountNumber: string): Omit<MrrDataIssue, "linkedCompanyName"> => ({
    awsAccountNumber,
    companyName: flow(
      filter(byPayerAccount(awsAccountNumber)),
      map("companyName"),
      uniq,
      join(", ")
    )(mrr),
  });

const mapAccountName = (accounts: Account[]) => (accountId: string) =>
  flow(
    find(({ id }) => id === accountId),
    get("name")
  )(accounts);

const addLinkedAccountNames =
  (mrr: Mrr[], accounts: Account[]) =>
  (issue: Omit<MrrDataIssue, "linkedCompanyName">): MrrDataIssue => ({
    ...issue,
    linkedCompanyName: flow(
      filter(byPayerAccount(issue.awsAccountNumber)),
      map("payerAccountAccountId"),
      uniq,
      map(mapAccountName(accounts)),
      join(", ")
    )(mrr),
  });

const companiesDontMatch = ({ companyName, linkedCompanyName }: MrrDataIssue) =>
  companyName !== linkedCompanyName;

export const setPayerAccountIssues = (
  mrr: Mrr[] | undefined,
  accounts: Account[] | undefined,
  setIssues: Dispatch<SetStateAction<MrrDataIssue[]>>
) =>
  mrr &&
  accounts &&
  flow(
    identity<Mrr[]>,
    map("awsAccountNumber"),
    uniq,
    map(addCompanyNames(mrr)),
    map(addLinkedAccountNames(mrr, accounts)),
    filter(companiesDontMatch),
    orderBy(["companyName"], ["asc"]),
    setIssues
  )(mrr);
