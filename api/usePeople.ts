import { type Schema } from "@/amplify/data/resource";
import {
  filterPersonByQuery,
  limitItems,
  mapPersonToSuggestion,
  SuggestionItem,
} from "@/helpers/ui-notes-writer/suggestions";
import { generateClient } from "aws-amplify/data";
import { filter, flow, join, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { Account, fetchAccounts } from "./ContextAccounts";
import { handleApiErrors } from "./globals";
import { mapPerson, Person, selectionSet } from "./usePerson";
const client = generateClient<Schema>();

const fetchPeople = async () => {
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
      map(mapPerson),
      sortBy((p) => -p.updatedAt.getTime())
    )(data);
  } catch (error) {
    console.error("fetchPeople", { error });
    throw error;
  }
};

type QueryPersonMemo = {
  people: Person[] | undefined;
  accounts: Account[] | undefined;
};

const queryPersonMemo: QueryPersonMemo = {
  people: undefined,
  accounts: undefined,
};

export const queryPerson = async (query: string): Promise<SuggestionItem[]> => {
  if (!queryPersonMemo.people) {
    queryPersonMemo.people = await fetchPeople();
  }
  if (!queryPersonMemo.accounts) {
    queryPersonMemo.accounts = await fetchAccounts();
  }
  const { people, accounts } = queryPersonMemo;
  const getAccountNamesByIds = (ids: string[]) =>
    flow(
      filter((a: Account) => ids.includes(a.id)),
      map((a) => a.name),
      join(", ")
    )(accounts);
  return flow(
    filter(filterPersonByQuery(query)),
    map(mapPersonToSuggestion(getAccountNamesByIds)),
    limitItems(7)
  )(people);
};

const usePeople = () => {
  const {
    data: people,
    error: errorPeople,
    isLoading: loadingPeople,
    mutate: mutatePeople,
  } = useSWR("/api/people", fetchPeople);

  const createPerson = async (name: string) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
      updatedAt: new Date(),
      details: [],
      accounts: [],
    };
    const updated = [...(people || []), newPerson];
    mutatePeople(updated, false);

    const { data, errors } = await client.models.Person.create({ name });
    if (errors) handleApiErrors(errors, "Error creating person");
    mutatePeople(updated);
    return data?.id;
  };

  const personName = (person?: Person) =>
    !person
      ? ""
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}${
          person.accounts.length === 0
            ? ""
            : ` (${person.accounts.map((a) => a.accountName)})`
        }`;

  const getNamesByIds = (personIds?: string[]) =>
    personIds &&
    people &&
    flow(
      filter((p: Person) => personIds.includes(p.id)),
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
