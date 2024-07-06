import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import useSWR from "swr";
const client = generateClient<Schema>();

const selectionSet = ["meeting.activities.id"] as const;

type ActivityData = SelectionSet<
  Schema["MeetingParticipant"]["type"],
  typeof selectionSet
>;

const mapActivity = ({ meeting }: ActivityData): string[] =>
  meeting.activities.map((a) => a.id);

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
  const { data: activityIds } = useSWR(
    `/api/people/${personId}/activities`,
    fetchPersonActivities(personId)
  );

  return { activityIds };
};

export default usePersonActivities;
