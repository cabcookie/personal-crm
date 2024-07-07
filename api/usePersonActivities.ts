import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

const selectionSet = [
  "meeting.activities.id",
  "meeting.activities.forProjects.projects.id",
] as const;

type ActivityData = SelectionSet<
  Schema["MeetingParticipant"]["type"],
  typeof selectionSet
>;

export type PersonActivity = {
  id: string;
  projectIds: string[];
};

const mapActivity = ({ meeting }: ActivityData): PersonActivity[] =>
  meeting.activities.map(({ id, forProjects }) => ({
    id,
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
  if (errors) throw errors;
  if (!data)
    throw new Error(`Reading meeting data for person ${personId} failed`);
  return data.flatMap(mapActivity);
};

const usePersonActivities = (personId?: string) => {
  const { data: activities } = useSWR(
    `/api/people/${personId}/activities`,
    fetchPersonActivities(personId)
  );

  return { activities };
};

export default usePersonActivities;
