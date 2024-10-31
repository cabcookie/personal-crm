import { Account } from "@/api/ContextAccounts";
import { Mrr } from "@/api/useMrr";
import {
  filter,
  find,
  flow,
  get,
  identity,
  join,
  map,
  flatMap,
  orderBy,
  uniq,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";
import { byPayerAccount } from "./analytics";

export type MrrDataIssue = {
  awsAccountNumber: string;
  companyName: string;
  linkedCompanyName: string;
};

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

const addCompanyNames =
  (mrr: Mrr[]) =>
  (awsAccountNumber: string): Omit<MrrDataIssue, "linkedCompanyName"> => ({
    awsAccountNumber,
    companyName: flow(
      filter(byPayerAccount(awsAccountNumber)),
      orderBy("companyName", "asc"),
      map("companyName"),
      uniq,
      join(", ")
    )(mrr),
  });

const addLinkedAccountNames =
  (mrr: Mrr[], accounts: Account[]) =>
  (issue: Omit<MrrDataIssue, "linkedCompanyName">): MrrDataIssue => ({
    ...issue,
    linkedCompanyName: flow(
      identity<Mrr[]>,
      filter(byPayerAccount(issue.awsAccountNumber)),
      flatMap("payerAccountAccountIds"),
      uniq,
      map(mapAccountName(accounts)),
      orderBy("", "asc"),
      join(", ")
    )(mrr),
  });

const companiesDontMatch = ({ companyName, linkedCompanyName }: MrrDataIssue) =>
  companyName !== linkedCompanyName;

const mapAccountName = (accounts: Account[]) => (accountId: string) =>
  flow(
    find(({ id }) => id === accountId),
    get("name")
  )(accounts);
