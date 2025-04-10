import { getTextFromJson } from "./get-text-from-json";

export const mapAccount = ({
  name,
  shortName,
  createdAt,
  subsidiaries,
}: AccountData): Account[] => [
  {
    name,
    shortName: shortName || undefined,
    createdAt: new Date(createdAt),
  },
  ...(subsidiaries?.items.flatMap(mapAccount) || []),
];

export const mapAccountLearnings = ({
  name,
  introduction,
  introductionJson,
  learnings,
  subsidiaries,
  createdAt,
}: AccountData): Learning[] => [
  ...(learnings.items.map(({ learnedOn, createdAt, learning }) => ({
    about: `Account: ${name}`,
    learnedOn: new Date(learnedOn || createdAt),
    learning: getTextFromJson(learning),
  })) ?? []),
  ...(subsidiaries?.items.flatMap(mapAccountLearnings) ?? []),
  ...(introductionJson || introduction
    ? [
        {
          about: `Account: ${name}`,
          learnedOn: new Date(createdAt),
          learning: getTextFromJson(introductionJson || introduction || ""),
        },
      ]
    : []),
];

export type Account = {
  name: string;
  shortName?: string | null;
  createdAt: Date;
};

export type Learning = {
  about: string;
  learnedOn: Date;
  learning: string;
};
