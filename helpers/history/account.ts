import { union, unionBy } from "lodash";
import { flow, identity, sortBy, filter } from "lodash/fp";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { type Person, mapPeopleLearnings } from "./person";
import { type Learning, getLocaleDateString, makeDate } from "./generals";

export type AccountMapped = {
  id: string;
  name: string;
  shortName?: string | null;
  learnings: Learning[];
};

export type AccountData = {
  id: string;
  name: string;
  shortName?: string | null;
  createdAt: string;
  people: {
    personId: string;
  }[];
  introduction?: string | null;
  introductionJson: any;
  learnings: {
    id: string;
    learnedOn?: string | null;
    createdAt: string;
    learning: any;
  }[];
  subsidiaries: AccountData[];
};

export const mapAccount = (
  a: AccountData,
  people: Person[]
): AccountMapped | null =>
  !a
    ? null
    : {
        id: a.id,
        name: a.name,
        shortName: a.shortName,
        learnings: mapLearning(a)(people),
      };

const mapLearning = (a: AccountData) =>
  flow(
    identity<Person[]>,
    mapPeopleLearnings,
    (l) => unionBy(mapIntroduction(a), mapAccountLearning(a), l, "learnedOn"),
    filter((l) => !!l.learning),
    sortBy((a) => a.learnedOn.getTime())
  );

const mapIntroduction = (a: AccountData): Learning[] =>
  a &&
  Boolean(
    a.introduction ||
      getTextFromJsonContent(JSON.parse(a.introductionJson as any))
  )
    ? union<Learning>(
        [
          {
            id: a.id,
            label: getLocaleDateString(a.createdAt),
            learnedOn: makeDate(a.createdAt),
            learning: `${a.name}${!a.shortName ? "" : ` (${a.shortName})`}\n${
              !a.introductionJson
                ? a.introduction
                : getTextFromJsonContent(JSON.parse(a.introductionJson as any))
            }`,
          },
        ],
        a.subsidiaries?.flatMap(mapIntroduction)
      )
    : [];

const mapAccountLearning = (a: AccountData): Learning[] =>
  !a?.learnings
    ? []
    : a.learnings.reduce(
        (prev, curr) =>
          unionBy<Learning>(
            prev,
            [
              {
                id: curr.id,
                label: getLocaleDateString(curr.createdAt, curr.learnedOn),
                learnedOn: makeDate(curr.createdAt, curr.learnedOn),
                learning: !curr.learning
                  ? ""
                  : getTextFromJsonContent(JSON.parse(curr.learning as any)),
              },
            ],
            a.subsidiaries?.flatMap(mapAccountLearning),
            "id"
          ),
        [] as Learning[]
      );
