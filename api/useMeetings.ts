import { type Schema } from "@/amplify/data/resource";
import { Context } from "@/contexts/ContextContext";
import {
  addDaysToDate,
  makeDate,
  newDateString,
  newDateTimeString,
  toISODateString,
} from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { flow } from "lodash";
import { get, map, sortBy, uniq } from "lodash/fp";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Activity, mapActivity } from "./useActivity";
const client = generateClient<Schema>();

export type Meeting = {
  id: string;
  topic: string;
  context?: Context;
  meetingOn: Date;
  meetingDayStr: string;
  participantMeetingIds: string[];
  participantIds: string[];
  activities: Activity[];
  hasOldVersionFormattedActivities: boolean;
};

export const meetingSelectionSet = [
  "id",
  "topic",
  "context",
  "meetingOn",
  "createdAt",
  "participants.id",
  "participants.personId",
  "activities.id",
  "activities.notes",
  "activities.formatVersion",
  "activities.notesJson",
  "activities.meetingActivitiesId",
  "activities.finishedOn",
  "activities.createdAt",
  "activities.updatedAt",
  "activities.forProjects.id",
  "activities.forProjects.projectsId",
  "activities.noteBlockIds",
  "activities.noteBlocks.id",
  "activities.noteBlocks.content",
  "activities.noteBlocks.type",
  "activities.noteBlocks.todo.id",
  "activities.noteBlocks.todo.todo",
  "activities.noteBlocks.todo.status",
  "activities.noteBlocks.todo.doneOn",
  "activities.noteBlocks.people.id",
  "activities.noteBlocks.people.personId",
] as const;

type MeetingData = SelectionSet<
  Schema["Meeting"]["type"],
  typeof meetingSelectionSet
>;

export const mapMeeting: (data: MeetingData) => Meeting = ({
  id,
  topic,
  meetingOn,
  context,
  createdAt,
  participants,
  activities,
}) => ({
  id,
  topic,
  meetingOn: new Date(meetingOn || createdAt),
  meetingDayStr: toISODateString(new Date(meetingOn || createdAt)),
  context: context || undefined,
  participantMeetingIds: participants.map(({ id }) => id),
  participantIds: participants.map(({ personId }) => personId),
  activities: flow(
    map(mapActivity),
    sortBy((a) => -a.finishedOn.getTime())
  )(activities),
  hasOldVersionFormattedActivities: activities.some(
    (a) => !a.formatVersion || a.formatVersion < 3
  ),
});

const calculateToDate = (startDate: string) =>
  flow(makeDate, addDaysToDate(4 * 7 + 1), toISODateString)(startDate);

type FetchMeetingsWithTokenFunction = (props: {
  startDate: string;
  token?: string;
  context: Context;
}) => Promise<MeetingData[] | undefined>;

const fetchMeetingsWithToken: FetchMeetingsWithTokenFunction = async ({
  startDate,
  token,
  context,
}) => {
  const toDate = calculateToDate(startDate);

  const filter = {
    and: [
      {
        or: [
          { context: { eq: context } },
          {
            and: [
              { context: { ne: "work" } },
              { context: { ne: "family" } },
              { context: { ne: "hobby" } },
            ],
          },
        ],
      },
      {
        or: [
          {
            and: [
              { meetingOn: { ge: startDate } },
              { meetingOn: { lt: toDate } },
            ],
          },
          {
            and: [
              { meetingOn: { attributeExists: false } },
              { createdAt: { ge: startDate } },
              { createdAt: { lt: toDate } },
            ],
          },
        ],
      },
    ],
  };

  const { data, errors, nextToken } = await client.models.Meeting.list({
    filter,
    selectionSet: meetingSelectionSet,
    nextToken: token,
    limit: 1000,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading meetings");
    throw errors;
  }
  if (!nextToken) return data;
  return [
    ...data,
    ...((await fetchMeetingsWithToken({
      startDate,
      token: nextToken,
      context,
    })) || []),
  ];
};

const fetchMeetings = (startDate: string, context?: Context) => async () => {
  if (!context) return;
  try {
    return (await fetchMeetingsWithToken({ startDate, context }))
      ?.map(mapMeeting)
      .sort((a, b) => b.meetingOn.getTime() - a.meetingOn.getTime());
  } catch (error) {
    console.error("fetchMeetings", { error });
    throw error;
  }
};

type UseMeetingsProps = {
  context?: Context;
  startDate?: string;
};

export const defaultStartDate = flow(
  addDaysToDate(-4 * 7),
  toISODateString
)(new Date());

const useMeetings = ({
  context,
  startDate = defaultStartDate,
}: UseMeetingsProps) => {
  const {
    data: meetings,
    error: errorMeetings,
    isLoading: loadingMeetings,
    mutate: mutateMeetings,
  } = useSWR(
    `/api/meetings/${context}/start-date/${startDate}`,
    fetchMeetings(startDate, context)
  );
  const [meetingDates, setMeetingDates] = useState<string[]>([]);

  const createMeeting = async (
    topic: string,
    context?: Context
  ): Promise<string | undefined> => {
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      topic,
      meetingOn: new Date(),
      meetingDayStr: newDateString(),
      participantIds: [],
      participantMeetingIds: [],
      activities: [],
      hasOldVersionFormattedActivities: false,
    };
    const updatedMeetings = [newMeeting, ...(meetings || [])];
    mutateMeetings(updatedMeetings, false);
    const { data, errors } = await client.models.Meeting.create({
      topic,
      meetingOn: newDateTimeString(),
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating a meeting");
    mutateMeetings(updatedMeetings);
    return data?.id;
  };

  useEffect(() => {
    flow(map(get("meetingDayStr")), uniq, setMeetingDates)(meetings);
  }, [meetings]);

  return {
    meetings,
    errorMeetings,
    loadingMeetings,
    meetingDates,
    createMeeting,
  };
};

export default useMeetings;
