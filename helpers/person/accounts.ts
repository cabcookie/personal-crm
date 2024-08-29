import { PersonData } from "@/api/usePerson";
import { isFuture } from "date-fns";
import { flow, map, sortBy } from "lodash/fp";

type AccountData = PersonData["accounts"][number];

type PersonAccountChangeProps = {
  startDate?: Date;
  endDate?: Date;
  position?: string;
  accountId?: string;
};

export type PersonAccountCreateProps = {
  accountId: string;
} & PersonAccountChangeProps;

export type PersonAccountUpdateProps = {
  personAccountId: string;
} & PersonAccountChangeProps;

export type PersonAccount = {
  personAccountId: string;
  accountId: string;
  accountName: string;
  startDate?: Date;
  endDate?: Date;
  position?: string;
  isCurrent: boolean;
};

const mapAccount = (a: AccountData): PersonAccount => ({
  personAccountId: a.id,
  accountId: a.account?.id,
  accountName: a.account?.name,
  startDate: !a.startDate ? undefined : new Date(a.startDate),
  endDate: !a.endDate ? undefined : new Date(a.endDate),
  position: a.position || undefined,
  isCurrent: !a.endDate || isFuture(new Date(a.endDate)),
});

export const getAccounts = flow(
  map(mapAccount),
  sortBy((a) => -(a.startDate?.getTime() || 0))
);
