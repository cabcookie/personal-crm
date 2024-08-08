import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { flatMap, flatten, flow, get, uniq } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Meeting } from "./useMeetings";
const client = generateClient<Schema>();

const fetchPerson = async (personId: string) => {
  const { data, errors } = await client.models.Person.get(
    { id: personId },
    {
      selectionSet: ["meetings.meeting.activities.forProjects.projectsId"],
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading meeting project recommendations");
    throw errors;
  }
  return flow(
    get("meetings"),
    flatMap(get("meeting.activities")),
    flatMap(get("forProjects")),
    flatMap(get("projectsId"))
  )(data);
};

const fetchMeetingProjectRecommendation = (meeting?: Meeting) => async () => {
  if (!meeting) return;
  const data = await Promise.all(meeting.participantIds.map(fetchPerson));
  return flow(flatten, uniq)(data) as string[] | undefined;
};

const useMeetingProjectRecommendation = (meeting?: Meeting) => {
  const {
    data: projectIds,
    isLoading,
    error,
  } = useSWR(
    `/api/meetings/${meeting?.id}/recommendations`,
    fetchMeetingProjectRecommendation(meeting)
  );

  return { projectIds, isLoading, error };
};

export default useMeetingProjectRecommendation;
