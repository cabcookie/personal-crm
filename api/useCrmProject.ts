import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import {
  addMinutesToDate,
  toISODateString,
  toISODateTimeString,
} from "@/helpers/functional";
import { calcRevenueTwoYears } from "@/helpers/projects";
import { generateClient } from "aws-amplify/data";
import { flow, isUndefined, omitBy } from "lodash";
import { findIndex, get, identity } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import {
  CrmProject,
  mapCrmProject,
  selectionSetCrmProject,
} from "./useCrmProjects";
const client = generateClient<Schema>();

export const STAGES_PROBABILITY = [
  { stage: "Prospect", probability: 10 },
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
    projectLinkIds: _projectLinkIds,
    projectIds: _projectIds,
    linkedPartnerNames: _linkedPartnerName,
    projectAccountNames: _projectAccountNames,
    pipeline: _pipeline,
    hygieneIssuesResolved: _hygieneIssuesResolved,
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
      createdDate: createdDate ?? crmProject.createdDate,
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

  const getProjectLinkIdByIndex =
    (crmProject: CrmProject | undefined) => (index: number) =>
      flow(
        identity<CrmProject | undefined>,
        get("projectLinkIds"),
        get(index)
      )(crmProject);

  const getProjectLinkIdByProjectId = (projectId: string) =>
    flow(
      identity<CrmProject | undefined>,
      get("projectIds"),
      findIndex((id) => id === projectId),
      getProjectLinkIdByIndex(crmProject)
    )(crmProject);

  const removeProjectFromCrmProject = async (
    projectId: string,
    projectName: string
  ) => {
    if (!crmProject) return;
    const projectLinkId = getProjectLinkIdByProjectId(projectId);
    if (!projectLinkId) return;
    const updated = {
      ...crmProject,
      projectIds: crmProject.projectIds.filter((id) => id !== projectId),
      projectLinkIds: crmProject.projectLinkIds.filter(
        (id) => id !== projectLinkId
      ),
    } as CrmProject;
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProjectProjects.delete({
      id: projectLinkId,
    });
    if (errors)
      handleApiErrors(errors, "Unlinking project from CRM project failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Unlinked project from CRM project",
      description: `Project “${projectName}” has been unlinked from CRM project “${crmProject.name}”.`,
    });
    return data.id;
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

  const confirmSolvingHygieneIssues = async () => {
    if (!crmProject) return;
    const updated: CrmProject = {
      ...crmProject,
      hygieneIssuesResolved: true,
    };
    mutate(updated, false);
    const { data, errors } = await client.models.CrmProject.update({
      id: crmProject.id,
      confirmHygieneIssuesSolvedTill: flow(
        addMinutesToDate(4 * 60),
        toISODateTimeString
      )(new Date()),
    });
    if (errors)
      handleApiErrors(errors, "Confirming solving hygiene issues failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Hygiene issues solved",
      description: `Hygiene issues solved for project “${crmProject.name}” confirmed. If the CRM projects are not imported within 4 hours, the status returns to show the hygiene issues.`,
    });
  };

  return {
    crmProject,
    error,
    isLoading,
    updateCrmProject,
    addProjectToCrmProject,
    confirmSolvingHygieneIssues,
    removeProjectFromCrmProject,
  };
};

export default useCrmProject;
