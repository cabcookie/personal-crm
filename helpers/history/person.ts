import { SelectionSet } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { client } from "@/pages/projects/[id]/history/index";
import { union } from "lodash";
import { sortBy, identity, map, flow } from "lodash/fp";
import { AccountData } from "./account";
import { getLocaleDateString, makeDate, type Learning } from "./generals";
import { type Project } from "./project";

export type Person = {
  id: string;
  name: string;
  learnings: Learning[];
  positions: {
    accountId: string;
    position: string;
  }[];
};

export const getPeople = async (peopleIds: string[]) => {
  const people = await Promise.all(peopleIds.map(mapPersonId));
  return people.filter((p) => p !== null);
};

export const mapPeopleIds = (a: AccountData): string[] =>
  !a.people
    ? []
    : a.people.reduce((prev, curr) => {
        const subs = a.subsidiaries?.flatMap(mapPeopleIds);
        return union(prev, [curr.personId], subs);
      }, [] as string[]);

export const mapPeopleLearnings = (people: Person[]): Learning[] =>
  people
    .filter((p) => p?.learnings?.length && p.learnings.length > 0)
    .flatMap((p) => p.learnings);

const mapPersonId = async (id: string) => {
  const person = await getPerson(id);
  if (!person) return null;
  return person;
};

const getPerson = async (personId: string): Promise<Person | null> => {
  const { data, errors } = await client.models.Person.get(
    { id: personId },
    { selectionSet }
  );
  if (errors || !data) return null;
  return mapPerson(data);
};

const mapLearning =
  (name: string) =>
  ({
    id,
    learnedOn,
    createdAt,
    learning,
  }: PersonData["learnings"][number]): Learning => ({
    id: id,
    label: `${name} (${getLocaleDateString(createdAt, learnedOn)})`,
    learnedOn: makeDate(createdAt, learnedOn),
    learning: getTextFromJsonContent(JSON.parse(learning as any)),
  });

const mapPerson = ({ id, name, learnings, accounts }: PersonData): Person => ({
  id,
  name,
  learnings: flow(
    identity<PersonData["learnings"]>,
    map(mapLearning(name)),
    sortBy((l) => l.learnedOn.getTime())
  )(learnings),
  positions: flow(
    identity<typeof accounts>,
    map(mapPosition),
    sortPositions
  )(accounts),
});

type PersonPosition = {
  accountId: string;
  position?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

const sortPositions = (positions: PersonPosition[]) =>
  positions.sort(comparePositions);

const diffDates = (a: string, b: string) =>
  new Date(b).getTime() - new Date(a).getTime();

const comparePositions = (a: PersonPosition, b: PersonPosition) =>
  !b.endDate
    ? !a.endDate
      ? !b.startDate
        ? 0
        : !a.startDate
          ? 0
          : diffDates(b.startDate, a.startDate)
      : !b.startDate
        ? 0
        : diffDates(b.startDate, a.endDate)
    : !a.endDate
      ? !a.startDate
        ? 0
        : diffDates(b.endDate, a.startDate)
      : diffDates(b.endDate, a.endDate);

const mapPosition = ({
  startDate,
  endDate,
  position,
  account,
}: PersonData["accounts"][number]) => {
  const timeTxt =
    startDate && endDate
      ? `${getLocaleDateString(startDate)} - ${getLocaleDateString(endDate)}: `
      : startDate
        ? `Since ${getLocaleDateString(startDate)}: `
        : endDate
          ? `Until ${getLocaleDateString(endDate)}: `
          : "";
  return {
    accountId: account.id,
    position: !position ? "" : `${timeTxt}${position}`,
  };
};

const selectionSet = [
  "id",
  "name",
  "learnings.id",
  "learnings.learnedOn",
  "learnings.createdAt",
  "learnings.learning",
  "accounts.startDate",
  "accounts.endDate",
  "accounts.position",
  "accounts.account.id",
  "accounts.account.name",
] as const;

type PersonData = SelectionSet<Schema["Person"]["type"], typeof selectionSet>;
