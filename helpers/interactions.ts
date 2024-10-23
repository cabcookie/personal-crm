import { AccountData } from "@/api/useInteractions";
import { differenceInWeeks, isFuture, isPast } from "date-fns";
import { compact, filter, flow, get, identity, map, size } from "lodash/fp";

export type Interaction = {
  personId: string;
  positions: string;
  name: string;
  meetings: number;
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

const isMeetingDateInRange = (weeks: number) => (date: Date) =>
  differenceInWeeks(new Date(), date) <= weeks;

const mapInteraction = (
  weeks: number,
  peersOrCustomers: PeersOrCustomersFilter,
  { positions, meetings, ...existing }: Interaction,
  ad: AccountData
): Interaction =>
  ({
    ...existing,
    positions: [
      ...(!positions ? [] : [positions]),
      ...(peersOrCustomers === "PEERS" ? [] : [ad.account?.name ?? ""]),
      ad.position,
    ].join(", "),
    meetings:
      (flow(
        identity<AccountData>,
        get("person.meetings"),
        map("meeting"),
        compact,
        map(getMeetingDate),
        filter(isMeetingDateInRange(weeks)),
        size
      )(ad) ?? 0) + meetings,
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
    meetings: 0,
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

export const hasMeetings = ({ meetings }: Interaction) => Boolean(meetings);
