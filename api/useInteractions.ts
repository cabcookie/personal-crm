import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flow, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { fetchUser } from "./useUser";
import {
  hasMeetings,
  isCurrentRole,
  PeersOrCustomersFilter,
  reduceInteractions,
} from "@/helpers/interactions";
const client = generateClient<Schema>();

const selectionSet = [
  "startDate",
  "endDate",
  "position",
  "account.name",
  "person.id",
  "person.name",
  "person.meetings.meeting.meetingOn",
  "person.meetings.meeting.createdAt",
] as const;

export type AccountData = SelectionSet<
  Schema["PersonAccount"]["type"],
  typeof selectionSet
>;

const fetchInteractions =
  (weeks: number, peersOrCustomers: PeersOrCustomersFilter) => async () => {
    const { currentAccountId } = await fetchUser();
    if (!currentAccountId) return;
    const { data, errors } =
      peersOrCustomers === "PEERS"
        ? await client.models.PersonAccount.listPersonAccountByAccountId(
            {
              accountId: currentAccountId,
            },
            {
              selectionSet,
              limit: 5000,
            }
          )
        : await client.models.PersonAccount.list({
            filter: { accountId: { ne: currentAccountId } },
            selectionSet,
            limit: 5000,
          });
    if (errors) {
      handleApiErrors(errors, "Error loading interactions");
      throw errors;
    }
    try {
      return flow(
        filter(isCurrentRole),
        reduceInteractions(weeks, peersOrCustomers),
        filter(hasMeetings),
        sortBy(({ meetings }) => -meetings)
      )(data);
    } catch (error) {
      console.error("Error in fetchInteractions", error);
      throw error;
    }
  };

export const useInteractions = (
  weeks: number,
  peersOrCustomers: PeersOrCustomersFilter
) => {
  const {
    data: interactions,
    error,
    isLoading,
  } = useSWR(
    `/api/interactions/${weeks}/${peersOrCustomers}`,
    fetchInteractions(weeks, peersOrCustomers)
  );

  return { interactions, error, isLoading };
};
