import { PersonAccountData } from "@/api/useAccountPeople";
import { isFuture, isPast } from "date-fns";
import { flow, get, map, max } from "lodash/fp";

type ActivityData =
  PersonAccountData["person"]["meetings"][number]["meeting"]["activities"][number];
type LearningData = PersonAccountData["person"]["learnings"][number];

export type AccountPerson = {
  id: string;
  name: string;
};

export const personName = ({
  person: { id, name },
  position,
}: PersonAccountData): AccountPerson => ({
  id,
  name: `${name}${!position ? "" : ` (${position})`}`,
});

export const isCurrentRole = ({ startDate, endDate }: PersonAccountData) =>
  (!endDate || isFuture(new Date(endDate))) &&
  (!startDate || isPast(new Date(startDate)));

export const getLatestUpdate = (p: PersonAccountData) =>
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
