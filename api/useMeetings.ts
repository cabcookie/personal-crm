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
    .sort(
      (a, b) =>
        new Date(b.finishedOn || b.createdAt).getTime() -
        new Date(a.finishedOn || a.createdAt).getTime()
    )
    .map(({ id }) => id),
});

const fetchMeetings = (page: number, context?: Context) => async () => {
  if (!context) return;
  const toDate = flow(
    addDaysToDate(-4 * (page - 1) * 7 + 1),
    getDayOfDate
  )(new Date());
  const fromDate = flow(addDaysToDate(-4 * page * 7), getDayOfDate)(new Date());
  const { data, errors } = await client.models.Meeting.list({
    filter: {
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
    },
    selectionSet: meetingSelectionSet,
  });
  if (errors) throw errors;
  return data
    .map(mapMeeting)
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

  // const updateActivityNotes = async (notes: string, activityId: string) => {
  //   const updated: Meeting[] =
  //     meetings?.map((meeting) => ({
  //       ...meeting,
  //       activities: meeting.activities.map((activity) =>
  //         activity.id !== activityId ? activity : { ...activity, notes }
  //       ),
  //     })) || [];
  //   mutateMeetings(updated, false);
  //   const { data, errors } = await client.models.Activity.update({
  //     id: activityId,
  //     notes,
  //   });
  //   if (errors) handleApiErrors(errors, "Error updating activity notes");
  //   mutateMeetings(updated);
  //   return data.id;
  // };

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
    // updateActivityNotes,
  };
};

export default useMeetings;
