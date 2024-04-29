import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import { Context } from "@/contexts/ContextContext";
import useSWR from "swr";
import { flow } from "lodash";
import { addDaysToDate, getDayOfDate } from "@/helpers/functional";
const client = generateClient<Schema>();

export type Meeting = {
  id: string;
  topic: string;
  context?: Context;
  meetingOn: Date;
  participantIds: string[];
  activityIds: string[];
};

export const meetingSelectionSet = [
  "id",
  "topic",
  "context",
  "meetingOn",
  "createdAt",
  "participants.person.id",
  "activities.id",
  "activities.finishedOn",
  "activities.createdAt",
] as const;

type MeetingData = SelectionSet<Schema["Meeting"], typeof meetingSelectionSet>;

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
  context: context || undefined,
  participantIds: participants.map(({ person: { id } }) => id),
  activityIds: activities
    .map(({ id, finishedOn, createdAt }) => ({
      id,
      finishedOn: new Date(finishedOn || createdAt),
    }))
    .sort((a, b) => a.finishedOn.getTime() - b.finishedOn.getTime())
    .map(({ id }) => id),
});

type FetchMeetingsWithTokenFunction = (props: {
  page: number;
  token?: string;
  context: Context;
}) => Promise<MeetingData[] | undefined>;

const fetchMeetingsWithToken: FetchMeetingsWithTokenFunction = async ({
  page,
  token,
  context,
}) => {
  const toDate = flow(
    addDaysToDate(-4 * (page - 1) * 7 + 1),
    getDayOfDate
  )(new Date());
  const fromDate = flow(addDaysToDate(-4 * page * 7), getDayOfDate)(new Date());
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
              { meetingOn: { gt: fromDate } },
              { meetingOn: { le: toDate } },
            ],
          },
          {
            and: [
              { meetingOn: { attributeExists: false } },
              { createdAt: { gt: fromDate } },
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
  });
  if (errors) throw errors;
  if (!nextToken) return data;
  return [
    ...data,
    ...((await fetchMeetingsWithToken({ page, token: nextToken, context })) ||
      []),
  ];
};

const fetchMeetings = (page: number, context?: Context) => async () => {
  if (!context) return;
  return (await fetchMeetingsWithToken({ page, context }))
    ?.map(mapMeeting)
    .sort((a, b) => b.meetingOn.getTime() - a.meetingOn.getTime());
};

type UseMeetingsProps = {
  context?: Context;
  page?: number;
};

const useMeetings = ({ page = 1, context }: UseMeetingsProps) => {
  const {
    data: meetings,
    error: errorMeetings,
    isLoading: loadingMeetings,
    mutate: mutateMeetings,
  } = useSWR(
    `/api/meetings/${context}/page/${page}`,
    fetchMeetings(page, context)
  );
  const [meetingDates, setMeetingDates] = useState<Date[]>([]);

  const createMeeting = async (
    topic: string,
    context?: Context
  ): Promise<string | undefined> => {
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      topic,
      meetingOn: new Date(),
      participantIds: [],
      activityIds: [],
    };
    const updatedMeetings = [newMeeting, ...(meetings || [])];
    mutateMeetings(updatedMeetings, false);
    const { data, errors } = await client.models.Meeting.create({
      topic,
      meetingOn: new Date().toISOString(),
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating a meeting");
    mutateMeetings(updatedMeetings);
    return data.id;
  };

  useEffect(() => {
    setMeetingDates(
      meetings
        ?.reduce((prev: string[], curr) => {
          const day = curr.meetingOn.toISOString().split("T")[0];
          return [...prev, ...(prev.includes(day) ? [] : [day])];
        }, [] as string[])
        .map((d) => new Date(d)) || []
    );
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
