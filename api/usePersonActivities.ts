import { type Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/data";
import {
  filter,
  flatMap,
  flow,
  identity,
  map,
  sortBy,
  union,
  uniqBy,
} from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { client } from "@/lib/amplify";

const selectionSetMeetings = [
  "meetingId",
  "meeting.activities.id",
  "meeting.activities.createdAt",
  "meeting.activities.finishedOn",
  "meeting.activities.forProjects.projects.id",
] as const;

type MeetingActivityData = SelectionSet<
  Schema["MeetingParticipant"]["type"],
  typeof selectionSetMeetings
>;

const selectionSetMentions = [
  "noteBlock.activity.id",
  "noteBlock.activity.createdAt",
  "noteBlock.activity.finishedOn",
  "noteBlock.activity.forProjects.projects.id",
  "noteBlock.activity.meetingActivitiesId",
] as const;

type MentionActivityData = SelectionSet<
  Schema["NoteBlockPerson"]["type"],
  typeof selectionSetMentions
>;

export type PersonActivity = {
  id: string;
  finishedOn: Date;
  projectIds: string[];
  meetingId?: string;
};

const mapMeetingActivity = ({
  meeting,
  meetingId,
}: MeetingActivityData): PersonActivity[] =>
  meeting.activities.map(({ id, finishedOn, createdAt, forProjects }) => ({
    id,
    finishedOn: new Date(finishedOn || createdAt),
    projectIds: forProjects.map((p) => p.projects.id),
    meetingId,
  }));

const mapMentionActivity = ({
  noteBlock,
}: MentionActivityData): PersonActivity => ({
  id: noteBlock.activity.id,
  finishedOn: new Date(
    noteBlock.activity.finishedOn || noteBlock.activity.createdAt
  ),
  projectIds: noteBlock.activity.forProjects.map((p) => p.projects.id),
  meetingId: noteBlock.activity.meetingActivitiesId || undefined,
});

const fetchMentionedPersonActivities = async (personId: string) => {
  const { data, errors } = await client.models.NoteBlockPerson.listByPersonId(
    {
      personId,
    },
    {
      limit: 200,
      sortDirection: "DESC",
      selectionSet: selectionSetMentions,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading mentioned activities");
    throw errors;
  }
  if (!data) throw new Error(`Reading person ${personId} mentions failed`);
  try {
    return flow(
      identity<MentionActivityData[] | undefined>,
      filter((a) => !!a.noteBlock?.activity),
      map(mapMentionActivity),
      sortBy((a) => -a.finishedOn.getTime())
    )(data);
  } catch (error) {
    console.error("fetchPersonActivities", { error });
    throw error;
  }
};

const fetchPersonActivities = (personId?: string) => async () => {
  if (!personId) return;
  const mentionedPersonActivities =
    await fetchMentionedPersonActivities(personId);
  const { data, errors } =
    await client.models.MeetingParticipant.listMeetingParticipantByPersonIdAndCreatedAt(
      {
        personId,
      },
      {
        limit: 200,
        sortDirection: "DESC",
        selectionSet: selectionSetMeetings,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading person activities");
    throw errors;
  }
  if (!data)
    throw new Error(`Reading meeting data for person ${personId} failed`);
  try {
    return flow(
      flatMap(mapMeetingActivity),
      union(mentionedPersonActivities),
      uniqBy<PersonActivity>("id"),
      sortBy((a) => -a.finishedOn.getTime())
    )(data);
  } catch (error) {
    console.error("fetchPersonActivities", { error });
    throw error;
  }
};

const usePersonActivities = (personId?: string) => {
  const { data: activities } = useSWR(
    `/api/people/${personId}/activities`,
    fetchPersonActivities(personId)
  );

  return { activities };
};

export default usePersonActivities;
