import { MeetingUpdateProps } from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import { LeanPerson } from "@/api/usePeople";
import { Context } from "@/contexts/ContextContext";
import { debounce } from "lodash";
import { first, flow, get, identity, split } from "lodash/fp";
import { includesNormalized, normalize } from "./functional";

const getFirstName = flow(identity<string>, split(" "), first);
const getAccountName = flow(identity<string>, split(","), first);

type CreateMeetingNameProps = {
  people?: LeanPerson[];
  participantId?: string;
};
export const createMeetingName = ({
  people,
  participantId,
}: CreateMeetingNameProps) => {
  const person = people?.find((p) => p.id === participantId);
  if (!person) return;
  return `Meet ${getFirstName(person.name)}${
    !person.accountNames ? "" : `/${getAccountName(person.accountNames)}`
  }`;
};

export const debouncedUpdateMeeting = (
  meeting: Meeting,
  updateMeeting: (props: MeetingUpdateProps) => void
) =>
  debounce(
    async ({ meetingOn, title }: { meetingOn?: Date; title?: string }) => {
      if (!meeting) return;
      await updateMeeting({
        title: title || meeting.topic,
        meetingOn: meetingOn || meeting.meetingOn,
      });
    },
    1500
  );

export type CreateMeetingProps = {
  topic: string;
  context?: Context;
  participantId?: string;
};

export const MEETING_FILTERS = ["All", "With Todos", "Old versions"] as const;

export type TMeetingFilters = (typeof MEETING_FILTERS)[number];

export const isValidMeetingFilter = (
  filter: string
): filter is TMeetingFilters =>
  MEETING_FILTERS.includes(filter as TMeetingFilters);

export const hasTodos = (meeting: Meeting) =>
  !meeting.immediateTasksDone && meeting.hasOpenTodos;

export const hasOldVersion = (meeting: Meeting) =>
  meeting.hasOldVersionFormattedActivities;

export const topicIncludesSearchText = (searchText: string) =>
  flow(
    identity<Meeting>,
    get("topic"),
    normalize,
    includesNormalized(searchText)
  );
