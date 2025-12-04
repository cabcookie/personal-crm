import { isAfter, isBefore } from "date-fns";
import { client } from "./get-client";
import { mapQuery } from "./queries";
import { notNull } from ".";

/* ========= CACHE ========= */

const personCache = new Map<string, string>();

export const clearPersonCache = () => {
  personCache.clear();
};

/* ========= FUNCTIONS ========= */

export const getPeopleFromCache = (ids: string[]) => {
  const cachedPeople: string[] = [];
  const remainingIds: string[] = [];

  for (const id of ids) {
    if (personCache.has(id)) {
      cachedPeople.push(personCache.get(id)!);
    } else {
      remainingIds.push(id);
    }
  }

  return {
    people: cachedPeople,
    remainingIds,
  };
};

export const getPerson = async (id: string) => {
  // Check cache first
  if (personCache.has(id)) return personCache.get(id)!;

  console.log("Fetching data for Person ID:", id);

  const { data, errors } = await client.graphql({
    query: queryPerson,
    variables: { id },
  });

  if (errors)
    throw new Error(
      `Error in getPerson: ${
        errors.map((err) => err.message).join(". ") || "Query failed"
      }`
    );
  if (!data || !data.getPerson) return "";

  const result = mapPerson(data.getPerson);

  // Store in cache
  personCache.set(id, result);

  return result;
};

const mapPerson = (person: NonNullable<GetPersonData["getPerson"]>) => {
  const now = new Date();
  const company = person.accounts?.items
    .filter(
      (a) =>
        (!a?.endDate || isBefore(now, a.endDate)) &&
        (!a?.startDate || isAfter(now, a.startDate))
    )
    .map((a) => [a?.position, a?.account?.name].filter(notNull).join(" at "))
    .join(", ");
  return `${person.name}${!company ? "" : ` (${company})`}`;
};

/* ========== QUERIES ========== */

export const queryPerson = [
  "query getPersonId($id: ID!)",
  [
    "getPerson(id: $id)",
    [
      "id",
      "name",
      "accounts",
      ["items", ["account", ["name"], "endDate", "position", "startDate"]],
    ],
  ],
].reduce<string>(mapQuery(0), "") as GeneratedPersonQuery;

type GeneratedPersonQuery = string & {
  __generatedQueryInput: {
    id: string;
  };
  __generatedQueryOutput: GetPersonData;
};

export type GetPersonData = {
  getPerson?: {
    id: string;
    name: string;
    accounts?: {
      items: Array<{
        startDate?: string | null;
        position?: string | null;
        endDate?: string | null;
        account?: {
          name: string;
        } | null;
      } | null>;
      nextToken?: string | null;
    } | null;
  } | null;
};
