import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { flatMap, flow, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const selectionSet = [
  "meeting.activities.id",
  "meeting.activities.createdAt",
  "meeting.activities.finishedOn",
  "meeting.activities.forProjects.projects.id",
] as const;

type ActivityData = SelectionSet<
  Schema["MeetingParticipant"]["type"],
  typeof selectionSet
>;

export type PersonActivity = {
  id: string;
  finishedOn: Date;
  projectIds: string[];
};

const mapActivity = ({ meeting }: ActivityData): PersonActivity[] =>
  meeting.activities.map(({ id, finishedOn, createdAt, forProjects }) => ({
    id,
    finishedOn: new Date(finishedOn || createdAt),
    projectIds: forProjects.map((p) => p.projects.id),
  }));

const fetchPersonActivities = (personId?: string) => async () => {
  if (!personId) return;
  const { data, errors } =
    await client.models.MeetingParticipant.listMeetingParticipantByPersonId(
      {
        personId,
      },
      {
        selectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading person activities");
    throw errors;
  }
  if (!data)
    throw new Error(`Reading meeting data for person ${personId} failed`);
  return flow(
    flatMap(mapActivity),
    sortBy((a) => -a.finishedOn.getTime())
  )(data);
};

const usePersonActivities = (personId?: string) => {
  const { data: activities } = useSWR(
    `/api/people/${personId}/activities`,
    fetchPersonActivities(personId)
  );

  return { activities };
};

export default usePersonActivities;
