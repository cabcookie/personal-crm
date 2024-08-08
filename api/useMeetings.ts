import { type Schema } from "@/amplify/data/resource";
import { Context } from "@/contexts/ContextContext";
import { addDaysToDate, getDayOfDate } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { flow } from "lodash";
import { map, sortBy } from "lodash/fp";
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
  participantMeetingIds: string[];
  participantIds: string[];
  activities: Activity[];
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
  "activities.hasOpenTasks",
  "activities.meetingActivitiesId",
  "activities.finishedOn",
  "activities.createdAt",
  "activities.updatedAt",
  "activities.forProjects.id",
  "activities.forProjects.projectsId",
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
  context: context || undefined,
  participantMeetingIds: participants.map(({ id }) => id),
  participantIds: participants.map(({ personId }) => personId),
  activities: flow(
    map(mapActivity),
    sortBy((a) => -a.finishedOn.getTime())
  )(activities),
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
    limit: 1000,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading meetings");
    throw errors;
  }
  if (!nextToken) return data;
  return [
    ...data,
    ...((await fetchMeetingsWithToken({ page, token: nextToken, context })) ||
      []),
  ];
};

const fetchMeetings = (page: number, context?: Context) => async () => {
  if (!context) return;
  try {
    return (await fetchMeetingsWithToken({ page, context }))
      ?.map(mapMeeting)
      .sort((a, b) => b.meetingOn.getTime() - a.meetingOn.getTime());
  } catch (error) {
    console.error("fetchMeetings", { error });
    throw error;
  }
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
      participantMeetingIds: [],
      activities: [],
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
    return data?.id;
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
