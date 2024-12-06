import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { fetchUser, User } from "@/api/useUser";
import { getAccounts } from "@/helpers/person/accounts";
import { generateClient, SelectionSet } from "aws-amplify/data";
import {
  compact,
  filter,
  flatMap,
  flow,
  get,
  identity,
  join,
  map,
  reduce,
  some,
  sortBy,
} from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

const selectionSet = [
  "activity.createdAt",
  "activity.finishedOn",
  "activity.forMeeting.participants.person.id",
  "activity.forMeeting.participants.person.name",
  "activity.forMeeting.participants.person.howToSay",
  "activity.forMeeting.participants.person.accounts.id",
  "activity.forMeeting.participants.person.accounts.startDate",
  "activity.forMeeting.participants.person.accounts.endDate",
  "activity.forMeeting.participants.person.accounts.position",
  "activity.forMeeting.participants.person.accounts.account.id",
  "activity.forMeeting.participants.person.accounts.account.name",
] as const;

type InvolvedPersonData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  // @ts-expect-error selectionSet is deep, however it works perfectly
  typeof selectionSet
>;

type InvolvedPerson = {
  id: string;
  name: string;
  lastInteraction: Date;
  howToSay?: string;
  accountNames?: string;
  isPeerOfUser?: boolean;
};

const getCurrentAccounts = flow(
  getAccounts,
  filter((pa) => pa.isCurrent)
);

const mapInvolvedPerson =
  (user: User) =>
  ({
    createdAt,
    finishedOn,
    forMeeting,
  }: InvolvedPersonData["activity"]): InvolvedPerson[] =>
    flow(
      identity<typeof forMeeting>,
      get("participants"),
      map("person"),
      map(({ id, name, howToSay, accounts }) => ({
        id,
        name,
        howToSay: howToSay || undefined,
        lastInteraction: new Date(finishedOn || createdAt),
        accountNames: flow(
          getCurrentAccounts,
          map(
            ({ accountName, position }) =>
              `${accountName}${!position ? "" : `, ${position}`}`
          ),
          join(", ")
        )(accounts),
        isPeerOfUser: !user.currentAccountId
          ? undefined
          : flow(
              getCurrentAccounts,
              some(({ accountId }) => accountId === user.currentAccountId)
            )(accounts),
      }))
    )(forMeeting);

const fetchInvolvedPeople = (projectId: string) => async () => {
  const user = await fetchUser();
  const options = { limit: 1000, selectionSet };
  const operation =
    client.models.ProjectActivity.listProjectActivityByProjectsId;
  // @ts-expect-error selectionSet is deep, however it works perfectly
  const { data, errors } = await operation({ projectsId: projectId }, options);
  if (errors) {
    handleApiErrors(errors, "Loading InvolvedPerson failed");
    throw errors;
  }
  try {
    return flow(
      identity<InvolvedPersonData[] | undefined>,
      map("activity"),
      compact,
      flatMap(mapInvolvedPerson(user)),
      sortBy((p) => -p.lastInteraction.getTime()),
      reduce<InvolvedPerson, InvolvedPerson[]>(
        (prev, curr) =>
          prev.some(
            (p) =>
              p.id === curr.id &&
              p.lastInteraction.getTime() > curr.lastInteraction.getTime()
          )
            ? prev
            : [...prev.filter((p) => p.id !== curr.id), curr],
        []
      )
    )(data);
  } catch (error) {
    console.error("fetchInvolvedPeople", error);
    throw error;
  }
};

const useInvolvedPeople = (projectId: string) => {
  const {
    data: involvedPeople,
    isLoading,
    error,
  } = useSWR(
    `/api/project/id/${projectId}/involved-people`,
    fetchInvolvedPeople(projectId)
  );

  return { involvedPeople, isLoading, error };
};

export default useInvolvedPeople;
