import { filter, flow, identity, map, sortBy, join } from "lodash/fp";
import { getTextFromJson } from "./get-text-from-json";

const mapActivity = ({
  activity: {
    createdAt,
    finishedOn,
    noteBlockIds,
    noteBlocks,
    notes,
    notesJson,
    forMeeting,
  },
}: {
  activity: ActivityData;
}) =>
  ({
    on: new Date(finishedOn || createdAt),
    inMeeting: mapMeetingInfo(forMeeting),
    notes: !!noteBlockIds
      ? noteBlocksToText(noteBlockIds, noteBlocks)
      : !!notesJson
        ? getTextFromJson(notesJson)
        : notes,
  }) as ProjectNote;

export type ProjectNote = {
  on: Date;
  inMeeting?: {
    meetingTopic: string;
    participants: string[];
  };
  notes: string | null;
};

export const mapActivities = flow(
  map(mapActivity),
  sortBy((a) => a.on.getTime())
);

const noteBlocksToText = (
  noteBlockIds: string[],
  noteBlocks: { items: NoteBlockData[] }
) =>
  flow(
    identity<typeof noteBlockIds>,
    map((id) => noteBlocks.items.find((i) => i.id === id)),
    filter((b) => !!b),
    map((b) =>
      b.type === "taskItem"
        ? getTaskItem(b)
        : getTextFromJson(b.content, b.type)
    ),
    join("\n")
  )(noteBlockIds);

const getTaskItem = (b: NoteBlockData) =>
  `[${b.todo?.status === "DONE" ? "x" : ""}] ${getTextFromJson(b.todo?.todo ?? "")}`;

const mapMeetingInfo = (meeting: MeetingData | null) =>
  !meeting
    ? undefined
    : {
        meetingTopic: meeting.topic,
        participants: meeting.participants.items.map((p) => p.person.name),
      };
