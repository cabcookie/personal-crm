import { union } from "lodash";
import { client } from "../handler";
import { GraphQLQuery } from "aws-amplify/api";
import { GetPersonQuery } from "./person-query";
import { getTextFromJson } from "./get-text-from-json";

export const getPeople = async (peopleIds: string[]) => {
  const people = await Promise.all(peopleIds.map(mapPersonId));
  return people.filter((p) => p !== null);
};

export const mapPeopleIds = (a: AccountData): string[] =>
  !a.people
    ? []
    : a.people.items.reduce((prev, curr) => {
        const subs = a.subsidiaries?.items.flatMap(mapPeopleIds);
        return union(prev, [curr.personId], subs);
      }, [] as string[]);

export const mapPerson = ({ name, accounts }: InnerPersonData) =>
  ({
    name,
    workHistory: accounts?.items.map(
      ({ startDate, endDate, position, account }) => ({
        startDate: !startDate ? undefined : new Date(startDate),
        endDate: !endDate ? undefined : new Date(endDate),
        position,
        company: account?.name,
      })
    ),
  }) as Person;

export type Person = {
  name: string;
  workHistory?: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    position: string | null;
    company: string | undefined;
  }[];
};

export const mapPersonLearnings = ({ name, learnings }: InnerPersonData) =>
  learnings?.items.map(({ learnedOn, createdAt, learning }) => ({
    about: `Person: ${name}`,
    learnedOn: new Date(learnedOn || createdAt),
    learning: getTextFromJson(learning),
  })) ?? [];

const mapPersonId = async (id: string) => {
  const person = await getPerson(id);
  if (!person) return null;
  return person;
};

const getPerson = async (personId: string) => {
  try {
    const { data, errors } = await client.graphql<GraphQLQuery<PersonData>>({
      query: GetPersonQuery,
      variables: { id: personId },
    });
    if (errors) {
      console.error({ data, errors });
      return;
    }
    return data?.getPerson as InnerPersonData | undefined;
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
};
