import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { fetchUser } from "@/api/useUser";
import { LeanPerson, resolvePeopleByIds } from "@/api/usePeople";
import { SelectionSet } from "aws-amplify/data";
import { map, sortBy, flow } from "lodash/fp";
import useSWR from "swr";
import { client } from "@/lib/amplify";

const selectionSet = [
  "activity.forMeeting.meetingOn",
  "activity.forMeeting.createdAt",
  "activity.forMeeting.participants.personId",
] as const;

type InvolvedPersonData = SelectionSet<
  Schema["ProjectActivity"]["type"],
  typeof selectionSet
>;

type InvolvedPerson = LeanPerson & {
  lastInteraction: Date;
};

const getInvolvedPeopleIds = (data: InvolvedPersonData[]) => {
  // Create a record of latest interaction dates per person ID
  const latestDatesPerPerson: Record<string, Date> = {};

  // Process all activities to find latest date for each person
  data.forEach((item) => {
    if (!item.activity?.forMeeting) return;

    const { meetingOn, createdAt, participants } = item.activity.forMeeting;
    const interactionDate = new Date(meetingOn || createdAt);

    participants?.forEach((participant) => {
      const personId = participant.personId;

      if (
        !latestDatesPerPerson[personId] ||
        interactionDate > latestDatesPerPerson[personId]
      ) {
        latestDatesPerPerson[personId] = interactionDate;
      }
    });
  });

  return latestDatesPerPerson;
};

const fetchInvolvedPeople =
  (projectId: string) => async (): Promise<InvolvedPerson[]> => {
    await fetchUser();
    const { data, errors } =
      await client.models.ProjectActivity.listProjectActivityByProjectsId(
        { projectsId: projectId },
        { limit: 1000, selectionSet }
      );
    if (errors) {
      handleApiErrors(errors, "Loading InvolvedPerson failed");
      throw errors;
    }
    if (!data) return [];

    const latestDatesPerPerson = getInvolvedPeopleIds(data);
    const involvedIds = Object.keys(latestDatesPerPerson);

    try {
      // Load exactly the involved people by id (on demand, cached), then attach
      // their latest interaction date. No dependency on a preloaded full list.
      const people = await resolvePeopleByIds(involvedIds);
      return flow(
        map<LeanPerson, InvolvedPerson>((person) => ({
          ...person,
          lastInteraction: latestDatesPerPerson[person.id],
        })),
        sortBy(({ lastInteraction }) => -lastInteraction.getTime())
      )(people);
    } catch (error) {
      console.error("fetchInvolvedPeople", error);
      throw error;
    }
  };

const useInvolvedPeople = (projectId: string) => {
  const {
    data: involvedPeople,
    isLoading,
    error,
  } = useSWR(
    `/api/project/id/${projectId}/involved-people`,
    fetchInvolvedPeople(projectId)
  );

  return { involvedPeople, isLoading, error };
};

export default useInvolvedPeople;
