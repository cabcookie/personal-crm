import { Mrr, MrrWipData } from "@/api/useMrr";
import { formatDateYyyyMm } from "@/helpers/functional";
import { addMonths } from "date-fns";
import { flow, get, identity, map, replace, some } from "lodash/fp";

export const parseMonthToInt = flow(
  identity<string>,
  replace("-", ""),
  parseInt
);

export const mapPayerMrrs =
  (month: string) =>
  ({ payerAccount, mrr, ...rest }: PayerMrrsData): Mrr => ({
    month,
    mrr: mrr ?? 0,
    payerAccountAccountIds: flow(
      identity<PayerMrrsData["payerAccount"]>,
      get("accounts"),
      map("accountId")
    )(payerAccount),
    ...rest,
  });

export const byAccount =
  (account: string | undefined) =>
  ({ companyName }: Mrr) =>
    !account || companyName === account;

export const byPayerAccount =
  (payerAccount: string | undefined) =>
  ({ awsAccountNumber }: Mrr) =>
    !payerAccount || awsAccountNumber === payerAccount;

export const byMonth = (month: string) => (mrr: Mrr) => month === mrr.month;

export const hasResellerItems = flow(identity<Mrr[]>, some("isReseller"));

const substractMonthsFp = (noOfMonths: number) =>
  addMonths(new Date(), -noOfMonths);

const plus12 = (num: number) => num + 12;

export const getMinMonth = flow(
  identity<number>,
  plus12,
  substractMonthsFp,
  formatDateYyyyMm
);

type PayerMrrsData = MrrWipData["latestMonths"][number]["payerMrrs"][number];
