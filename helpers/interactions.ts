import { AccountData } from "@/api/useInteractions";
import { differenceInWeeks, isFuture, isPast } from "date-fns";
import {
  compact,
  filter,
  flow,
  get,
  identity,
  map,
  union,
  uniq,
} from "lodash/fp";

export type Interaction = {
  personId: string;
  positions: string;
  name: string;
  meetingIds: string[];
};

export const INTERACTION_TIME_FILTER = ["4", "13", "26", "52"];
const INTERACTION_TIME_FILTER_CONST = ["4", "13", "26", "52"] as const;
export type InteractionTimeFilter =
  (typeof INTERACTION_TIME_FILTER_CONST)[number];

export const PEERS_OR_CUSTOMERS = ["PEERS", "CUSTOMERS"];
const PEERS_OR_CUSTOMERS_CONST = ["PEERS", "CUSTOMERS"] as const;
export type PeersOrCustomersFilter = (typeof PEERS_OR_CUSTOMERS_CONST)[number];

export const isValidWeekFilter = (
  weeks: string
): weeks is InteractionTimeFilter =>
  INTERACTION_TIME_FILTER_CONST.includes(weeks as InteractionTimeFilter);

export const isValidPeersOrCustomersFilter = (
  peersOrCustomers: string
): peersOrCustomers is PeersOrCustomersFilter =>
  PEERS_OR_CUSTOMERS_CONST.includes(peersOrCustomers as PeersOrCustomersFilter);

export const isCurrentRole = ({ startDate, endDate }: AccountData) =>
  (!endDate || isFuture(new Date(endDate))) &&
  (!startDate || isPast(new Date(startDate)));

const getMeetingDate = ({
  meetingOn,
  createdAt,
}: AccountData["person"]["meetings"][number]["meeting"]) =>
  new Date(meetingOn ?? createdAt);

const isMeetingDateInRange =
  (weeks: number) =>
  (meeting: AccountData["person"]["meetings"][number]["meeting"]) =>
    differenceInWeeks(new Date(), getMeetingDate(meeting)) <= weeks;

const mapInteraction = (
  weeks: number,
  peersOrCustomers: PeersOrCustomersFilter,
  { positions, meetingIds, ...existing }: Interaction,
  ad: AccountData
): Interaction =>
  ({
    ...existing,
    positions: [
      ...(!positions ? [] : [positions]),
      ...(peersOrCustomers === "PEERS" ? [] : [ad.account?.name ?? ""]),
      ad.position,
    ].join(", "),
    meetingIds: flow(
      identity<AccountData>,
      get("person.meetings"),
      map("meeting"),
      compact,
      filter(isMeetingDateInRange(weeks)),
      map("id"),
      union(meetingIds),
      uniq
    )(ad),
  } as Interaction);

const interactionWithoutCurrentPerson = (
  interactions: Interaction[],
  person: AccountData["person"]
) => interactions.filter(({ personId }) => personId !== person.id);

const currentPerson = (
  interactions: Interaction[],
  person: AccountData["person"]
) =>
  interactions.find(({ personId }) => personId === person.id) ?? {
    personId: person.id,
    positions: "",
    name: person.name,
    meetingIds: [],
  };

export const reduceInteractions =
  (weeks: number, peersOrCustomers: PeersOrCustomersFilter) =>
  (interactions: AccountData[]) =>
    interactions.reduce(
      (prev, curr) =>
        !curr.person
          ? prev
          : [
              ...interactionWithoutCurrentPerson(prev, curr.person),
              mapInteraction(
                weeks,
                peersOrCustomers,
                currentPerson(prev, curr.person),
                curr
              ),
            ],
      [] as Interaction[]
    );

export const hasMeetings = ({ meetingIds }: Interaction) =>
  meetingIds.length > 0;
