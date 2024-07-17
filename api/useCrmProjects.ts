import { type Schema } from "@/amplify/data/resource";
import {
  addDaysToDate,
  getDayOfDate,
  toISODateString,
} from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { flow } from "lodash/fp";
import useSWR from "swr";
import { Project, useProjectsContext } from "./ContextProjects";
import { handleApiErrors } from "./globals";
import { CRM_STAGES, TCrmStages } from "./useCrmProject";
const client = generateClient<Schema>();

export type CrmProject = {
  id: string;
  name: string;
  crmId?: string;
  arr: number;
  tcv: number;
  isMarketplace: boolean;
  closeDate: Date;
  projectIds: string[];
  stage: TCrmStages;
};

export const selectionSetCrmProject = [
  "id",
  "name",
  "crmId",
  "annualRecurringRevenue",
  "totalContractVolume",
  "isMarketplace",
  "closeDate",
  "projects.project.id",
  "stage",
] as const;

export const mapCrmProject: (data: CrmProjectData) => CrmProject = ({
  id,
  name,
  crmId,
  annualRecurringRevenue,
  totalContractVolume,
  isMarketplace,
  closeDate,
  projects,
  stage,
}) => ({
  id,
  name,
  crmId: crmId || undefined,
  arr: annualRecurringRevenue || 0,
  tcv: totalContractVolume || 0,
  isMarketplace: !!isMarketplace,
  closeDate: new Date(closeDate),
  projectIds: projects.map(({ project: { id } }) => id),
  stage: CRM_STAGES.find((s) => s === stage) || "Prospect",
});

type CrmProjectData = SelectionSet<
  Schema["CrmProject"]["type"],
  typeof selectionSetCrmProject
>;

type FetchCrmProjectsWithTokenFn = (
  token?: string
) => Promise<CrmProjectData[] | undefined>;

const fetchCrmProjectsWithToken: FetchCrmProjectsWithTokenFn = async (
  token
) => {
  const closed = {
    or: [{ stage: { eq: "Launched" } }, { stage: { eq: "Closed Lost" } }],
  };

  const { data, errors, nextToken } = await client.models.CrmProject.list({
    filter: {
      or: [
        { not: closed },
        {
          and: [
            closed,
            {
              closeDate: {
                ge: flow(
                  addDaysToDate(-14),
                  toISODateString,
                  getDayOfDate
                )(new Date()),
              },
            },
          ],
        },
      ],
    },
    selectionSet: selectionSetCrmProject,
    nextToken: token,
    limit: 1000,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading CRM projects");
    throw errors;
  }
  if (!nextToken) return data;
  return [...data, ...((await fetchCrmProjectsWithToken(nextToken)) || [])];
};

const fetchCrmProjects = async () => {
  return (await fetchCrmProjectsWithToken())
    ?.map(mapCrmProject)
    .sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime());
};

const useCrmProjects = () => {
  const {
    data: crmProjects,
    error: errorCrmProjects,
    isLoading: loadingCrmProjects,
  } = useSWR("/api/crm-projects/", fetchCrmProjects);

  const { projects, mutateProjects } = useProjectsContext();

  const createCrmProject = async (project: CrmProject) => {
    const updated: Project[] | undefined = projects?.map((p) =>
      !project.projectIds.some((projectId) => projectId === p.id)
        ? p
        : {
            ...p,
            crmProjects: [
              ...p.crmProjects,
              {
                id: project.id,
                arr: project.arr,
                tcv: project.tcv,
                isMarketPlace: project.isMarketplace,
                closeDate: project.closeDate,
                stage: "Prospect",
              },
            ],
          }
    );

    if (updated) mutateProjects(updated, false);

    const { data: newProject, errors: projectErrors } =
      await client.models.CrmProject.create({
        closeDate: getDayOfDate(project.closeDate),
        name: project.name,
        stage: project.stage,
        annualRecurringRevenue: project.arr,
        crmId: project.crmId,
        totalContractVolume: project.tcv,
      });

    if (projectErrors) {
      handleApiErrors(projectErrors, "Error creating CRM project");
      return;
    }
    if (!newProject) return;
    const { errors } = await client.models.CrmProjectProjects.create({
      projectId: project.projectIds[0],
      crmProjectId: newProject.id,
    });
    if (errors) {
      handleApiErrors(errors, "Error linking CRM project to project");
      return;
    }

    if (updated) mutateProjects(updated);

    return newProject.id;
  };

  return {
    crmProjects,
    errorCrmProjects,
    loadingCrmProjects,
    createCrmProject,
  };
};

export default useCrmProjects;
