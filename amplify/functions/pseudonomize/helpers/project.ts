import { GraphQLQuery } from "aws-amplify/api";
import { client } from "../handler";
import { GetProjectQuery } from "./projects-query";
import {
  getPeople,
  mapPeopleIds,
  mapPerson,
  mapPersonLearnings,
  Person,
} from "./person";
import { Account, Learning, mapAccount, mapAccountLearnings } from "./account";
import { sortBy } from "lodash/fp";
import { mapActivities, ProjectNote } from "./activity";

export const getProjectData = async (projectId: string) => {
  const project = await getProject(projectId);
  if (!project) return;
  const people = await getProjectPeople(project);

  return {
    projectName: project.project,
    benefitingAccounts: getProjectAccounts(project),
    involvedPeople: people.map(mapPerson),
    learnings: getProjectLearnings(project, people),
    projectNotes: mapActivities(project.activities?.items),
  } as Project;
};

export type Project = {
  projectName: string;
  benefitingAccounts: Account[] | undefined;
  involvedPeople: Person[];
  learnings: Learning[];
  projectNotes: ProjectNote[];
};

const getProjectLearnings = (
  project: ProjectData["getProjects"],
  people: InnerPersonData[]
) =>
  sortBy<Learning>((l) => l.learnedOn.getTime())([
    ...(project.accounts?.items.flatMap(({ account }) =>
      mapAccountLearnings(account)
    ) ?? []),
    ...people.flatMap(mapPersonLearnings),
  ]);

const getProjectAccounts = (project: ProjectData["getProjects"]) =>
  project.accounts?.items.flatMap(({ account }) => mapAccount(account));

const getProjectPeople = async (project: ProjectData["getProjects"]) => {
  const peopleIds = project.accounts?.items.flatMap((a) =>
    mapPeopleIds(a.account)
  );
  return await getPeople(peopleIds ?? []);
};

const getProject = async (projectId: string) => {
  try {
    const { data, errors } = await client.graphql<GraphQLQuery<ProjectData>>({
      query: GetProjectQuery,
      variables: { id: projectId },
    });
    if (errors) {
      console.error({ data, errors });
      return;
    }
    return data?.getProjects;
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
};
