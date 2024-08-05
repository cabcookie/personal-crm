import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "@/helpers/functional";
import { calcRevenueTwoYears } from "@/helpers/projects";
import { generateClient } from "aws-amplify/data";
import { isUndefined, omitBy } from "lodash";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  CrmProject,
  mapCrmProject,
  selectionSetCrmProject,
} from "./useCrmProjects";
const client = generateClient<Schema>();

export const STAGES_PROBABILITY = [
  { stage: "Prospect", probability: 0 },
  { stage: "Qualified", probability: 20 },
  { stage: "Technical Validation", probability: 40 },
  { stage: "Business Validation", probability: 60 },
  { stage: "Committed", probability: 80 },
  { stage: "Closed Lost", probability: 0 },
  { stage: "Launched", probability: 100 },
] as const;

export const CRM_STAGES = [
  "Prospect",
  "Qualified",
  "Technical Validation",
  "Business Validation",
  "Committed",
  "Closed Lost",
  "Launched",
] as const;

export type TCrmStages = (typeof STAGES_PROBABILITY)[number]["stage"];

const fetchCrmProject = (projectId?: string) => async () => {
  if (!projectId) return;
  const { data, errors } = await client.models.CrmProject.get(
    { id: projectId },
    { selectionSet: selectionSetCrmProject }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading CRM project");
    throw errors;
  }
  if (!data) throw new Error("fetchCrmProject didn't retrieve data");
  try {
    return mapCrmProject(data);
  } catch (error) {
    console.error("fetchCrmProject", { error });
    throw error;
  }
};

const useCrmProject = (projectId?: string) => {
  const {
    data: crmProject,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/crm-projects/${projectId}`, fetchCrmProject(projectId));

  const updateCrmProject = async ({
    closeDate,
    createdDate,
    arr,
    tcv,
    stageChangedDate,
    projectIds: _projectIds,
    linkedPartnerNames: _linkedPartnerName,
    projectAccountNames: _projectAccountNames,
    pipeline: _pipeline,
    ...changedProject
  }: Partial<CrmProject>) => {
    if (!crmProject) return;
    const updated: CrmProject = ((updatedCrm: CrmProject) => ({
      ...updatedCrm,
      pipeline: calcRevenueTwoYears(updatedCrm),
    }))({
      ...(omitBy(crmProject, isUndefined) as CrmProject),
      ...omitBy(changedProject, isUndefined),
      arr: arr ?? crmProject.arr,
      tcv: tcv ?? crmProject.tcv,
      closeDate: closeDate ?? crmProject.closeDate,
      stageChangedDate: stageChangedDate ?? crmProject.stageChangedDate,
    });
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProject.update({
      ...changedProject,
      id: crmProject.id,
      closeDate: !closeDate ? undefined : toISODateString(closeDate),
      createdDate: !createdDate ? undefined : toISODateString(createdDate),
      annualRecurringRevenue: arr,
      totalContractVolume: tcv,
      stageChangedDate: !stageChangedDate
        ? undefined
        : toISODateString(stageChangedDate),
    });
    if (errors) handleApiErrors(errors, "Error updating CRM project");
    mutate(updated);
    return data?.id;
  };

  const addProjectToCrmProject = async (
    projectId: string,
    projectName: string
  ) => {
    if (!crmProject) return;
    const updated: CrmProject = {
      ...crmProject,
      projectIds: [...crmProject.projectIds, projectId],
    };
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProjectProjects.create({
      projectId,
      crmProjectId: crmProject.id,
    });
    if (errors)
      handleApiErrors(errors, "Linking project to CRM project failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Linked project to CRM project",
      description: `Project “${projectName}” has been linked to CRM project “${crmProject.name}”.`,
    });
    return data.id;
  };

  return {
    crmProject,
    error,
    isLoading,
    updateCrmProject,
    addProjectToCrmProject,
  };
};

export default useCrmProject;
