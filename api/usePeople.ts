import { getAccounts } from "@/helpers/person/accounts";
import {
  limitItems,
  mapPersonToSuggestion,
  SuggestionItem,
} from "@/helpers/ui-notes-writer/suggestions";
import { SelectionSet } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { filter, flow, join, map, some, sortBy } from "lodash/fp";
import useSWR, { mutate as globalMutate } from "swr";
import { handleApiErrors } from "./globals";
import { fetchUser, User } from "./useUser";
import { client } from "@/lib/amplify";
import { type Schema } from "@/amplify/data/resource";

export type LeanPerson = {
  id: string;
  name: string;
  howToSay?: string;
  accountNames?: string;
  isPeerOfUser?: boolean;
  updatedAt: Date;
};

/** How many recently-seen people to load into the initial in-memory set. */
const INITIAL_RECENT_LIMIT = 50;
/** Default number of semantic-search matches to pull. */
const SEARCH_TOP_K = 10;

const SWR_KEY = "/api/people";

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
      map((pa) => `${pa.accountName}${!pa.position ? "" : `, ${pa.position}`}`),
      join(", ")
    )(accounts),
    isPeerOfUser: !user.currentAccountId
      ? undefined
      : flow(
          getCurrentAccounts,
          some((pa) => pa.accountId === user.currentAccountId)
        )(accounts),
  });

/* -------------------------------------------------------------------------- *
 * Cache-and-keep store
 *
 * The app no longer loads every person into memory. Instead a module-level
 * cache grows over the session: the initial set is the 50 most recently seen
 * people (Person.lastSeen GSI), and anything else is pulled on demand — by id
 * (meeting participants, mentions) or via semantic search — and merged in.
 * Nothing is ever evicted. The cache is wrapped by a single SWR key so any
 * merge re-renders every consumer.
 * -------------------------------------------------------------------------- */
const peopleCache = new Map<string, LeanPerson>();
// Coalesce concurrent by-id fetches so N consumers asking for the same missing
// id trigger a single request.
const inFlightById = new Map<string, Promise<void>>();

const cacheValues = (): LeanPerson[] =>
  flow(sortBy((p: LeanPerson) => -p.updatedAt.getTime()))([
    ...peopleCache.values(),
  ]);

const mergeIntoCache = (people: LeanPerson[]): void => {
  for (const p of people) peopleCache.set(p.id, p);
};

/** Reconstruct the owner value the tables store: `sub::username`. */
const currentOwner = async (): Promise<string | undefined> => {
  try {
    const { userId, username } = await getCurrentUser();
    if (!userId || !username) return undefined;
    return `${userId}::${username}`;
  } catch {
    return undefined;
  }
};

/** Initial fetch: the 50 most recently seen people (sparse lastSeen GSI). */
const fetchRecentPeople = async (): Promise<LeanPerson[]> => {
  const user = await fetchUser();
  const owner = await currentOwner();
  if (!owner) return cacheValues();
  const { data, errors } = await client.models.Person.listPeopleByLastSeen(
    { owner },
    {
      sortDirection: "DESC",
      limit: INITIAL_RECENT_LIMIT,
      selectionSet,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading recent people");
    throw errors;
  }
  mergeIntoCache((data ?? []).map(mapPerson(user)));
  return cacheValues();
};

/** Fetch specific people by id (lean shape) and merge them into the cache. */
const loadPeopleByIds = async (ids: string[]): Promise<void> => {
  const missing = [...new Set(ids)].filter((id) => id && !peopleCache.has(id));
  if (!missing.length) return;
  const user = await fetchUser();
  await Promise.all(
    missing.map((id) => {
      const existing = inFlightById.get(id);
      if (existing) return existing;
      const p = (async () => {
        try {
          const { data, errors } = await client.models.Person.get(
            { id },
            { selectionSet }
          );
          if (errors) {
            handleApiErrors(errors, "Error loading person");
            return;
          }
          if (data) mergeIntoCache([mapPerson(user)(data)]);
        } finally {
          inFlightById.delete(id);
        }
      })();
      inFlightById.set(id, p);
      return p;
    })
  );
  // Re-render consumers with the freshly cached people.
  globalMutate(SWR_KEY, cacheValues(), false);
};

/**
 * Semantic (vector) search over the caller's own people. Merges matches into
 * the cache (so they render everywhere) and returns them as suggestion items.
 */
export const searchPeopleRemote = async (
  query: string
): Promise<LeanPerson[]> => {
  const q = query.trim();
  if (!q) return [];
  const { data, errors } = await client.queries.searchPeople({
    query: q,
    topK: SEARCH_TOP_K,
  });
  if (errors) {
    console.error("searchPeople", errors);
    return [];
  }
  const matches: LeanPerson[] = (data ?? []).flatMap((m) =>
    m && m.personId && m.name
      ? [
          {
            id: m.personId,
            name: m.name,
            // The vector match's `source` is "Name (Company, Role)"; keep the
            // structured company/role as accountNames for display parity.
            accountNames:
              [m.company, m.role].filter(Boolean).join(", ") || undefined,
            updatedAt: new Date(),
          },
        ]
      : []
  );
  mergeIntoCache(matches);
  globalMutate(SWR_KEY, cacheValues(), false);
  return matches;
};

/**
 * Async resolver for callers outside React render (e.g. SWR fetchers): loads
 * any missing ids into the cache, then returns the resolved LeanPersons (in the
 * input id order, skipping any that couldn't be loaded).
 */
export const resolvePeopleByIds = async (
  ids: string[]
): Promise<LeanPerson[]> => {
  await loadPeopleByIds(ids);
  return ids
    .map((id) => peopleCache.get(id))
    .filter((p): p is LeanPerson => !!p);
};

/** Mention-picker search: semantic search mapped to suggestion items. */
export const queryPerson = async (query: string): Promise<SuggestionItem[]> => {
  const matches = await searchPeopleRemote(query);
  return flow(map(mapPersonToSuggestion), limitItems(7))(matches);
};

const usePeople = () => {
  const {
    data: people,
    error: errorPeople,
    isLoading: loadingPeople,
    mutate: mutatePeople,
  } = useSWR(SWR_KEY, fetchRecentPeople);

  const createPerson = async (name: string) => {
    const newPerson: LeanPerson = {
      id: crypto.randomUUID(),
      name,
      updatedAt: new Date(),
    };
    mergeIntoCache([newPerson]);
    mutatePeople(cacheValues(), false);

    const { data, errors } = await client.models.Person.create({ name });
    if (errors) handleApiErrors(errors, "Error creating person");
    mutatePeople(cacheValues());
    return data?.id;
  };

  const personName = (person?: LeanPerson) =>
    !person
      ? ""
      : `${person.name}${!person.howToSay ? "" : ` (say: ${person.howToSay})`}${
          !person.accountNames ? "" : ` (${person.accountNames})`
        }`;

  /**
   * Names for a set of ids from the cache. Any id NOT yet cached triggers a
   * background by-id load that merges into the cache and re-renders — so a
   * referenced person (e.g. a meeting participant) is never permanently
   * invisible just because it wasn't in the initial recent set.
   */
  const getNamesByIds = (personIds?: string[]) => {
    if (!personIds || !people) return undefined;
    const missing = personIds.filter((id) => id && !peopleCache.has(id));
    if (missing.length) void loadPeopleByIds(missing);
    return flow(
      filter((p: LeanPerson) => personIds.includes(p.id)),
      map(personName),
      join(", ")
    )(people);
  };

  /** Resolve people by id from the cache; loads any missing on demand. */
  const getPeopleByIds = (personIds?: string[]): LeanPerson[] => {
    if (!personIds || !people) return [];
    const missing = personIds.filter((id) => id && !peopleCache.has(id));
    if (missing.length) void loadPeopleByIds(missing);
    return personIds
      .map((id) => peopleCache.get(id))
      .filter((p): p is LeanPerson => !!p);
  };

  const getPersonById = (personId?: string): LeanPerson | undefined => {
    if (!personId) return undefined;
    if (!peopleCache.has(personId)) void loadPeopleByIds([personId]);
    return peopleCache.get(personId);
  };

  return {
    people,
    errorPeople,
    loadingPeople,
    createPerson,
    getNamesByIds,
    getPeopleByIds,
    getPersonById,
    searchPeople: searchPeopleRemote,
    ensurePeopleLoaded: loadPeopleByIds,
  };
};

export default usePeople;
