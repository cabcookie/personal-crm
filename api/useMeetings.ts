import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import { Context } from "@/contexts/ContextContext";
import useSWR from "swr";
import { flow } from "lodash";
import { addDaysToDate, getDayOfDate } from "@/helpers/functional";
const client = generateClient<Schema>();

type Person = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  project: string;
  accountIds?: string[];
};

export type Activity = {
  id: string;
  notes: string;
  projectIds: string[];
  meetingId?: string;
  finishedOn: Date;
  updatedAt: Date;
};

export type Meeting = {
  id: string;
  topic: string;
  meetingOn: Date;
  context?: Context;
  participants: Person[];
  activities: Activity[];
};

export const meetingSelectionSet = [
  "id",
  "topic",
  "context",
  "meetingOn",
  "createdAt",
  "participants.person.id",
  "participants.person.name",
  "activities.id",
  "activities.notes",
  "activities.finishedOn",
  "activities.createdAt",
  "activities.updatedAt",
  "activities.forProjects.id",
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
  participants: participants.map(({ person: { id, name } }) => ({ id, name })),
  activities: activities
    .map(
      ({
        id,
        notes,
        finishedOn,
        forProjects,
        createdAt,
        updatedAt,
      }): Activity => ({
        id,
        notes: notes || "",
        projectIds: forProjects.map(({ id }) => id),
        finishedOn: new Date(finishedOn || createdAt),
        updatedAt: new Date(updatedAt),
      })
    )
    .sort((a, b) => a.finishedOn.getTime() - b.finishedOn.getTime()),
});

const fetchMeetings = (page: number, context?: Context) => async () => {
  if (!context) return;
  const compareDate = flow(addDaysToDate(-4 * 7), getDayOfDate)(new Date());
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
              meetingOn: { gt: compareDate },
            },
            {
              and: [
                { meetingOn: { attributeExists: false } },
                { createdAt: { gt: compareDate } },
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
      participants: [],
      activities: [],
    };
    const updatedMeetings = [newMeeting, ...(meetings || [])];
    mutateMeetings(updatedMeetings, false);
    const { data, errors } = await client.models.Meeting.create({
      ...newMeeting,
      meetingOn: newMeeting.meetingOn.toISOString(),
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating a meeting");
    mutateMeetings(updatedMeetings);
    return data.id;
  };

  const updateActivityNotes = async (notes: string, activityId: string) => {
    const updated: Meeting[] =
      meetings?.map((meeting) => ({
        ...meeting,
        activities: meeting.activities.map((activity) =>
          activity.id !== activityId ? activity : { ...activity, notes }
        ),
      })) || [];
    mutateMeetings(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activityId,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error updating activity notes");
    mutateMeetings(updated);
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
    updateActivityNotes,
  };
};

export default useMeetings;
