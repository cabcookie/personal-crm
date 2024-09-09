import { type Schema } from "@/amplify/data/resource";
import { getAccounts } from "@/helpers/person/accounts";
import {
  filterPersonByQuery,
  limitItems,
  mapPersonToSuggestion,
  SuggestionItem,
} from "@/helpers/ui-notes-writer/suggestions";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flow, join, map, some, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { fetchUser, User } from "./useUser";
const client = generateClient<Schema>();

export type LeanPerson = {
  id: string;
  name: string;
  howToSay?: string;
  accountNames?: string;
  isPeerOfUser?: boolean;
  updatedAt: Date;
};

const selectionSet = [
  "id",
  "name",
  "howToSay",
  "updatedAt",
  "accounts.id",
  "accounts.startDate",
  "accounts.endDate",
  "accounts.position",
  "accounts.account.id",
  "accounts.account.name",
] as const;

type PersonData = SelectionSet<Schema["Person"]["type"], typeof selectionSet>;

const getCurrentAccounts = flow(
  getAccounts,
  filter((pa) => pa.isCurrent)
);

const mapPerson =
  (user: User) =>
  ({ id, name, updatedAt, howToSay, accounts }: PersonData): LeanPerson => ({
    id,
    name,
    howToSay: howToSay ?? undefined,
    updatedAt: new Date(updatedAt),
    accountNames: flow(
      getCurrentAccounts,
      map(
        (pa) => `${pa.accountName}${!pa.position ? "" : ` (${pa.position})`}`
      ),
      join(", ")
    )(accounts),
    isPeerOfUser: !user.currentAccountId
      ? undefined
      : flow(
          getCurrentAccounts,
          some((pa) => pa.accountId === user.currentAccountId)
        )(accounts),
  });

const fetchPeople = async () => {
  const user = await fetchUser();
  const { data, errors } = await client.models.Person.list({
    limit: 2000,
    selectionSet,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading people");
    throw errors;
  }
  try {
    return flow(
      map(mapPerson(user)),
      sortBy((p) => -p.updatedAt.getTime())
    )(data);
  } catch (error) {
    console.error("fetchPeople", { error });
    throw error;
  }
};

let queryPeopleMemo: LeanPerson[] | undefined;

export const queryPerson = async (query: string): Promise<SuggestionItem[]> => {
  if (!queryPeopleMemo) {
    queryPeopleMemo = await fetchPeople();
  }
  return flow(
    filter(filterPersonByQuery(query)),
    map(mapPersonToSuggestion),
    limitItems(7)
  )(queryPeopleMemo);
};

const usePeople = () => {
  const {
    data: people,
    error: errorPeople,
    isLoading: loadingPeople,
    mutate: mutatePeople,
  } = useSWR("/api/people", fetchPeople);

  const createPerson = async (name: string) => {
    const newPerson: LeanPerson = {
      id: crypto.randomUUID(),
      name,
      updatedAt: new Date(),
    };
    const updated = [...(people || []), newPerson];
    mutatePeople(updated, false);

    const { data, errors } = await client.models.Person.create({ name });
    if (errors) handleApiErrors(errors, "Error creating person");
    mutatePeople(updated);
    return data?.id;
  };

  const personName = (person?: LeanPerson) =>
    !person
      ? ""
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}${
          !person.accountNames ? "" : ` (${person.accountNames})`
        }`;

  const getNamesByIds = (personIds?: string[]) =>
    personIds &&
    people &&
    flow(
      filter((p: LeanPerson) => personIds.includes(p.id)),
      map(personName),
      join(", ")
    )(people);

  return {
    people,
    errorPeople,
    loadingPeople,
    createPerson,
    getNamesByIds,
  };
};

export default usePeople;
