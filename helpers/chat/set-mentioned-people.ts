import { Schema } from "@/amplify/data/resource";
import { TPrayerStatus } from "@/components/prayer/PrayerStatus";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { transformNotesVersion } from "@/components/ui-elements/editors/helpers/transformers";
import { getAccounts, PersonAccount } from "@/helpers/person/accounts";
import {
  getRelationships,
  PersonRelationship,
} from "@/helpers/person/relationships";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/api";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  join,
  map,
  some,
  sortBy,
} from "lodash/fp";
import { Dispatch, SetStateAction } from "react";
import { getDateOrUndefined, makeDate } from "../functional";

const client = generateClient<Schema>();

type PersonLearning = {
  learning: string;
  learnedOn: Date;
  prayerStatus: TPrayerStatus;
};

type MeetingNotes = {
  topic: string;
  meetingOn: Date;
  participants: string[];
  notes: string;
};

export type MentionedPerson = {
  name: string;
  howToSay?: string;
  birthday?: Date;
  accounts: PersonAccount[];
  relationships: (Omit<PersonRelationship, "relatedPerson"> & {
    relatedPerson: string;
  })[];
  learnings: PersonLearning[];
  openTodos: string[];
  notesFromMeetings: MeetingNotes[];
};

const selectionSet = [
  "name",
  "howToSay",
  "birthday",
  "accounts.id",
  "accounts.startDate",
  "accounts.endDate",
  "accounts.position",
  "accounts.account.id",
  "accounts.account.name",
  "relationshipsFrom.id",
  "relationshipsFrom.date",
  "relationshipsFrom.endDate",
  "relationshipsFrom.typeName",
  "relationshipsFrom.relatedPerson.id",
  "relationshipsFrom.relatedPerson.name",
  "relationshipsFrom.relatedPerson.birthday",
  "relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsFrom.relatedPerson.relationshipsFrom.date",
  "relationshipsFrom.relatedPerson.relationshipsFrom.endDate",
  "relationshipsFrom.relatedPerson.relationshipsFrom.typeName",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.id",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.name",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.birthday",
  "relationshipsFrom.relatedPerson.relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsFrom.relatedPerson.relationshipsTo.date",
  "relationshipsFrom.relatedPerson.relationshipsTo.endDate",
  "relationshipsFrom.relatedPerson.relationshipsTo.typeName",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.id",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.name",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.birthday",
  "relationshipsFrom.relatedPerson.relationshipsTo.person.dateOfDeath",
  "relationshipsTo.id",
  "relationshipsTo.date",
  "relationshipsTo.endDate",
  "relationshipsTo.typeName",
  "relationshipsTo.person.id",
  "relationshipsTo.person.name",
  "relationshipsTo.person.birthday",
  "relationshipsTo.person.dateOfDeath",
  "relationshipsTo.person.relationshipsFrom.date",
  "relationshipsTo.person.relationshipsFrom.endDate",
  "relationshipsTo.person.relationshipsFrom.typeName",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.id",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.name",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.birthday",
  "relationshipsTo.person.relationshipsFrom.relatedPerson.dateOfDeath",
  "relationshipsTo.person.relationshipsTo.date",
  "relationshipsTo.person.relationshipsTo.endDate",
  "relationshipsTo.person.relationshipsTo.typeName",
  "relationshipsTo.person.relationshipsTo.person.id",
  "relationshipsTo.person.relationshipsTo.person.name",
  "relationshipsTo.person.relationshipsTo.person.birthday",
  "relationshipsTo.person.relationshipsTo.person.dateOfDeath",
  "learnings.learnedOn",
  "learnings.createdAt",
  "learnings.learning",
  "learnings.prayer",
  "noteBlocks.noteBlock.todo.todo",
  "noteBlocks.noteBlock.todo.status",
  "noteBlocks.noteBlock.todo.updatedAt",
  "meetings.meeting.topic",
  "meetings.meeting.meetingOn",
  "meetings.meeting.createdAt",
  "meetings.meeting.participants.person.name",
  "meetings.meeting.activities.formatVersion",
  "meetings.meeting.activities.noteBlockIds",
  "meetings.meeting.activities.noteBlocks.id",
  "meetings.meeting.activities.noteBlocks.type",
  "meetings.meeting.activities.noteBlocks.content",
  "meetings.meeting.activities.noteBlocks.todo.id",
  "meetings.meeting.activities.noteBlocks.todo.todo",
  "meetings.meeting.activities.noteBlocks.todo.status",
  "meetings.meeting.activities.noteBlocks.todo.doneOn",
  "meetings.meeting.activities.notes",
  "meetings.meeting.activities.notesJson",
  "meetings.meeting.activities.forProjects.id",
  "meetings.meeting.activities.forProjects.projectsId",
  "meetings.meeting.activities.forProjects.projects.project",
  "meetings.meeting.activities.forProjects.projects.done",
] as const;

type PersonData = SelectionSet<Schema["Person"]["type"], typeof selectionSet>;
type PersonLearningData = PersonData["learnings"][number];
type Activity = PersonData["meetings"][number]["meeting"]["activities"][number];

const mapLearning = ({
  learnedOn,
  createdAt,
  learning,
  prayer,
}: PersonLearningData): PersonLearning => ({
  learning: !learning
    ? ""
    : getTextFromJsonContent(JSON.parse(learning as any)),
  learnedOn: new Date(learnedOn || createdAt),
  prayerStatus: prayer || "NONE",
});

const mapOpenTodos = (noteBlocks: PersonData["noteBlocks"]): string[] =>
  flow(
    identity<typeof noteBlocks>,
    map("noteBlock.todo"),
    filter({ status: "OPEN" }),
    sortBy(flow(get("updatedAt"), makeDate, (d) => -d.getTime())),
    map("todo"),
    map(JSON.parse),
    map(getTextFromJsonContent)
  )(noteBlocks);

const getProjects = (activity: Activity) =>
  flow(
    identity<Activity>,
    get("forProjects"),
    map("projects"),
    filter((p) => !get("done")(p)),
    map("project"),
    join(", ")
  )(activity);

const mapNotes = (activity: Activity): string => {
  const document = transformNotesVersion({
    ...activity,
    noteBlocks: activity.noteBlocks.map((b) => ({ ...b, people: [] })),
  });
  return getTextFromJsonContent({
    ...document,
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: `Projects: ${getProjects(activity)}`,
          },
        ],
      },
      ...(document.content ?? []),
    ],
  });
};

const mapNotesFromMeetings = ({
  meeting: { participants, topic, createdAt, meetingOn, activities },
}: PersonData["meetings"][number]): MeetingNotes => ({
  meetingOn: new Date(meetingOn || createdAt),
  participants: flow(
    identity<typeof participants>,
    map("person.name")
  )(participants),
  topic,
  notes: flow(
    identity<typeof activities>,
    map(mapNotes),
    join("\n\n")
  )(activities),
});

const hasOpenMeetings = flow(
  identity<PersonData["meetings"]>,
  get("meeting.activities"),
  some(
    flow(
      get("forProjects"),
      some((p) => !get("projects.done")(p))
    )
  )
);

const mapPerson = ({
  name,
  birthday,
  howToSay,
  accounts,
  relationshipsFrom,
  relationshipsTo,
  learnings,
  noteBlocks,
  meetings,
}: PersonData): MentionedPerson => ({
  name: `@${name}`,
  howToSay: howToSay || undefined,
  birthday: getDateOrUndefined(birthday),
  accounts: getAccounts(accounts),
  relationships: flow(
    getRelationships,
    map(({ subRelations: _sr, relatedPerson, ...rest }) => ({
      ...rest,
      relatedPerson: relatedPerson?.name ?? "",
    }))
  )(relationshipsFrom, relationshipsTo),
  learnings: map(mapLearning)(learnings),
  openTodos: mapOpenTodos(noteBlocks),
  notesFromMeetings: flow(
    identity<PersonData["meetings"]>,
    filter(hasOpenMeetings),
    sortBy(
      ({ meeting: { meetingOn, createdAt } }) =>
        -new Date(meetingOn || createdAt).getTime()
    ),
    map(mapNotesFromMeetings)
  )(meetings),
});

const fetchPeople = async (id: string) => {
  const { data, errors } = await client.models.Person.get(
    { id },
    { selectionSet }
  );
  if (errors) throw errors;

  return flow(identity<PersonData | null>, mapPerson)(data);
};

const setResult =
  (
    setMentionedPeople: Dispatch<SetStateAction<MentionedPerson[] | undefined>>
  ) =>
  async (people: Promise<MentionedPerson>[]) => {
    const result = await Promise.all(people);
    console.log("setResult", result);
    setMentionedPeople(result);
  };

export const setMentionedPeopleByPrompt = (
  prompt: JSONContent,
  setMentionedPeople: Dispatch<SetStateAction<MentionedPerson[] | undefined>>
) => {
  flow(
    identity<JSONContent>,
    get("content"),
    filter({ type: "paragraph" }),
    flatMap("content"),
    filter({ type: "mention" }),
    map("attrs.id"),
    map(fetchPeople),
    setResult(setMentionedPeople)
  )(prompt);
};
