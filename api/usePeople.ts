import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { filter, flow, join, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Person, mapPerson, selectionSet } from "./usePerson";
const client = generateClient<Schema>();

const fetchPeople = async () => {
  const { data, errors } = await client.models.Person.list({
    limit: 2000,
    selectionSet,
  });
  if (errors) throw errors;
  return flow(
    map(mapPerson),
    sortBy((p) => -p.updatedAt.getTime())
  )(data);
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

  const getNamesByIds = (personIds?: string[]) =>
    personIds &&
    people &&
    flow(
      filter((p: Person) => personIds.includes(p.id)),
      map((p) => p.name),
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
