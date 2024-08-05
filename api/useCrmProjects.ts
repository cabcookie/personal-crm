import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { addDaysToDate, toISODateString } from "@/helpers/functional";
import {
  CalcPipelineFields,
  calcRevenueTwoYears,
  mapPipelineFields,
} from "@/helpers/projects";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { flatMap, flow, map, sortBy } from "lodash/fp";
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
  opportunityOwner?: string;
  nextStep?: string;
  partnerName?: string;
  type?: string;
  stageChangedDate?: Date;
  accountName?: string;
  territoryName?: string;
  pipeline?: number;
  projectAccountNames?: string[];
  linkedPartnerNames?: string[];
  createdDate: Date;
};

export const selectionSetCrmProject = [
  "id",
  "name",
  "crmId",
  "annualRecurringRevenue",
  "totalContractVolume",
  "isMarketplace",
  "closeDate",
  "createdDate",
  "createdAt",
  "projects.project.id",
  "projects.project.accounts.account.name",
  "stage",
  "opportunityOwner",
  "nextStep",
  "partnerName",
  "type",
  "stageChangedDate",
  "accountName",
  "territoryName",
  "projects.project.partner.name",
] as const;

type CrmProjectData = SelectionSet<
  Schema["CrmProject"]["type"],
  typeof selectionSetCrmProject
>;
type CrmProjectProjectData = CrmProjectData["projects"][number];

export const mapCrmProject: (data: CrmProjectData) => CrmProject = ({
  id,
  name,
  crmId,
  annualRecurringRevenue,
  totalContractVolume,
  isMarketplace,
  closeDate,
  createdAt,
  createdDate,
  projects,
  stage,
  stageChangedDate,
  opportunityOwner,
  nextStep,
  partnerName,
  type,
  accountName,
  territoryName,
}) => ({
  id,
  name,
  crmId: crmId || undefined,
  arr: annualRecurringRevenue || 0,
  tcv: totalContractVolume || 0,
  isMarketplace: !!isMarketplace,
  closeDate: new Date(closeDate),
  createdDate: new Date(createdDate || createdAt),
  projectIds: projects.map(({ project: { id } }) => id),
  stage: CRM_STAGES.find((s) => s === stage) || "Prospect",
  stageChangedDate: !stageChangedDate ? undefined : new Date(stageChangedDate),
  opportunityOwner: opportunityOwner ?? undefined,
  nextStep: nextStep ?? undefined,
  partnerName: partnerName ?? undefined,
  linkedPartnerNames: flow(
    flatMap((p: CrmProjectProjectData) => p.project.partner),
    map((a) => a?.name)
  )(projects),
  type: type ?? undefined,
  accountName: accountName ?? undefined,
  projectAccountNames: flow(
    flatMap((p: CrmProjectProjectData) => p.project.accounts),
    map((a) => a.account.name)
  )(projects),
  territoryName: territoryName ?? undefined,
  pipeline:
    flow(
      mapPipelineFields,
      calcRevenueTwoYears
    )({
      crmProject: {
        annualRecurringRevenue,
        closeDate,
        isMarketplace,
        stage,
        totalContractVolume,
      },
    } as CalcPipelineFields) ?? 0,
});

const fetchCrmProjects = async () => {
  const closed = {
    or: [{ stage: { eq: "Launched" } }, { stage: { eq: "Closed Lost" } }],
  };
  const filter = {
    or: [
      { not: closed },
      {
        and: [
          closed,
          {
            closeDate: {
              ge: flow(addDaysToDate(-30), toISODateString)(new Date()),
            },
          },
        ],
      },
    ],
  };
  const { data, errors } = await client.models.CrmProject.list({
    filter,
    selectionSet: selectionSetCrmProject,
    limit: 1000,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading CRM projects");
    throw errors;
  }
  try {
    return flow(
      map(mapCrmProject),
      sortBy((p) => -(p.pipeline || 0))
    )(data);
  } catch (error) {
    console.error("fetchCrmProjects", error);
    throw error;
  }
};

const useCrmProjects = () => {
  const {
    data: crmProjects,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/crm-projects/", fetchCrmProjects);

  const { projects, mutateProjects } = useProjectsContext();

  const closeCrmProject = async (id: string, stage: TCrmStages) => {
    const updated: CrmProject[] | undefined = crmProjects?.map((p) =>
      p.id !== id ? p : { ...p, stage }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.CrmProject.update({
      id,
      stage,
      closeDate: toISODateString(new Date()),
    });
    if (errors) handleApiErrors(errors, "Closing CRM project failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({
      title: "CRM Project closed",
      description: `Successfully closed CRM project “${data.name}” (Stage: ${data.stage}).`,
    });
    return data.id;
  };

  const createCrmProject = async (project: CrmProject) => {
    const updatedCrmProjects: CrmProject[] | undefined = [
      ...(crmProjects ?? []),
      project,
    ];

    const updatedProjects: Project[] | undefined = projects?.map((p) =>
      !project.projectIds.includes(p.id)
        ? p
        : {
            ...p,
            crmProjects: [...p.crmProjects, project],
          }
    );

    if (updatedProjects) mutateProjects(updatedProjects, false);
    if (updatedCrmProjects) mutate(updatedCrmProjects, false);

    const { data: newProject, errors: projectErrors } =
      await client.models.CrmProject.create({
        ...(({
          id: _id,
          arr: _arr,
          tcv: _tcv,
          projectIds: _projectIds,
          linkedPartnerNames: _linkedPartner,
          projectAccountNames: _accountNames,
          ...project
        }: CrmProject) => project)(project),
        closeDate: toISODateString(project.closeDate),
        createdDate: !project.createdDate
          ? null
          : toISODateString(project.createdDate),
        annualRecurringRevenue: project.arr,
        totalContractVolume: project.tcv,
        stageChangedDate: !project.stageChangedDate
          ? null
          : toISODateString(project.stageChangedDate),
      });

    if (projectErrors) {
      handleApiErrors(projectErrors, "Error creating CRM project");
      return;
    }
    if (!newProject) return;
    toast({
      title: "CRM project created",
      description: `Successfully created CRM project “${project.name}”.`,
    });

    if (project.projectIds.length > 0) {
      const { errors } = await client.models.CrmProjectProjects.create({
        projectId: project.projectIds[0],
        crmProjectId: newProject.id,
      });
      if (errors) {
        handleApiErrors(errors, "Error linking CRM project to project");
        return;
      }
    }

    if (updatedProjects) mutateProjects(updatedProjects);
    if (updatedCrmProjects) mutate(updatedCrmProjects);

    return newProject.id;
  };

  return {
    crmProjects,
    error,
    isLoading,
    createCrmProject,
    closeCrmProject,
    mutate,
  };
};

export default useCrmProjects;
