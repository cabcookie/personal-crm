import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { isFuture } from "date-fns";
import { filter, flow, get, identity, map, max, sortBy, uniq } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
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

type PersonAccountData = SelectionSet<
  Schema["PersonAccount"]["type"],
  typeof selectionSet
>;
type ActivityData =
  PersonAccountData["person"]["meetings"][number]["meeting"]["activities"][number];
type LearningData = PersonAccountData["person"]["learnings"][number];

const getLatestUpdate = (p: PersonAccountData) =>
  -max([
    new Date(p.person.updatedAt).getTime(),
    flow(
      get("person.meetings"),
      map(
        flow(
          get("meeting.activities"),
          map((a: ActivityData) =>
            new Date(a.finishedOn || a.createdAt).getTime()
          ),
          max
        )
      ),
      max
    )(p),
    flow(
      get("person.learnings"),
      map((l: LearningData) => new Date(l.learnedOn || l.createdAt).getTime()),
      max
    )(p),
  ]);

type AccountPerson = {
  id: string;
  name: string;
};

const mapPersonId = ({
  person: { id, name },
  position,
}: PersonAccountData): AccountPerson => ({
  id,
  name: `${name}${!position ? "" : ` (${position})`}`,
});

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
      filter((pa) => !pa.endDate || isFuture(new Date(pa.endDate))),
      sortBy(getLatestUpdate),
      map(mapPersonId),
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
