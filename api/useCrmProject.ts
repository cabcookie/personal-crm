import { type Schema } from "@/amplify/data/resource";
import { toISODateString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  CrmProject,
  mapCrmProject,
  selectionSetCrmProject,
} from "./useCrmProjects";
const client = generateClient<Schema>();

export const CRM_STAGES = [
  "Prospect",
  "Qualified",
  "Technical Validation",
  "Business Validation",
  "Committed",
  "Closed Lost",
  "Launched",
] as const;

export type TCrmStages = (typeof CRM_STAGES)[number];

export type CrmProjectOnChangeFields = {
  name?: string;
  arr?: number;
  tcv?: number;
  isMarketplace?: boolean;
  stage?: TCrmStages;
  closeDate?: Date;
  crmId?: string;
};

const fetchCrmProject = (projectId?: string) => async () => {
  if (!projectId) return;
  const { data, errors } = await client.models.CrmProject.get(
    { id: projectId },
    { selectionSet: selectionSetCrmProject }
  );
  if (errors) throw errors;
  if (!data) throw new Error("fetchCrmProject didn't retrieve data");
  return mapCrmProject(data);
};

const useCrmProject = (projectId?: string) => {
  const {
    data: crmProject,
    error: errorCrmProject,
    isLoading: loadingCrmProject,
    mutate,
  } = useSWR(`/api/crm-projects/${projectId}`, fetchCrmProject(projectId));

  const updateCrmProject = async ({
    closeDate,
    arr,
    tcv,
    ...changedProject
  }: CrmProjectOnChangeFields) => {
    if (!crmProject) return;
    const updated: CrmProject = {
      id: crmProject.id,
      name: changedProject.name || crmProject.name,
      arr: arr || crmProject.arr,
      tcv: tcv || crmProject.tcv,
      closeDate: closeDate || crmProject.closeDate,
      isMarketplace:
        changedProject.isMarketplace !== undefined
          ? changedProject.isMarketplace
          : crmProject.isMarketplace,
      crmId: changedProject.crmId || crmProject.crmId,
      projectIds: crmProject.projectIds,
      stage: changedProject.stage || crmProject.stage,
    };
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProject.update({
      id: crmProject.id,
      closeDate: !closeDate ? undefined : toISODateString(closeDate),
      annualRecurringRevenue: arr,
      totalContractVolume: tcv,
      ...changedProject,
    });
    if (errors) handleApiErrors(errors, "Error updating CRM project");
    mutate(updated);
    return data?.id;
  };

  return { crmProject, errorCrmProject, loadingCrmProject, updateCrmProject };
};

export default useCrmProject;
