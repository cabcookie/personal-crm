import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flow, identity, map, sortBy, uniq } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  getLatestUpdate,
  isCurrentRole,
  personName,
} from "@/helpers/account-people";
const client = generateClient<Schema>();

const selectionSet = [
  "startDate",
  "endDate",
  "position",
  "person.id",
  "person.name",
  "person.updatedAt",
  "person.meetings.meeting.activities.createdAt",
  "person.meetings.meeting.activities.finishedOn",
  "person.learnings.learnedOn",
  "person.learnings.createdAt",
] as const;

export type PersonAccountData = SelectionSet<
  Schema["PersonAccount"]["type"],
  typeof selectionSet
>;

const fetchPeople = (accountId?: string) => async () => {
  if (!accountId) return;
  const { data, errors } =
    await client.models.PersonAccount.listPersonAccountByAccountId(
      { accountId },
      {
        limit: 300,
        selectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading people");
    throw errors;
  }
  try {
    return flow(
      identity<PersonAccountData[] | undefined>,
      filter(isCurrentRole),
      sortBy(getLatestUpdate),
      map(personName),
      uniq
    )(data);
  } catch (error) {
    console.error("fetchPeople", { error });
    throw error;
  }
};

const useAccountPeople = (accountId?: string) => {
  const { data: people } = useSWR(
    `/api/accounts/${accountId}`,
    fetchPeople(accountId)
  );
  return { people };
};

export default useAccountPeople;
