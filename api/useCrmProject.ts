import { type Schema } from "@/amplify/data/resource";
import { getDayOfDate } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { useProjectsContext } from "./ContextProjects";
import { handleApiErrors } from "./globals";
import {
  CrmProject,
  mapCrmProject,
  selectionSetCrmProject,
} from "./useCrmProjects";
const client = generateClient<Schema>();

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
  } = useSWR(`/api/crm-projects/${projectId}`, fetchCrmProject(projectId));
  const { projects, mutateProjects } = useProjectsContext();

  const createCrmProject = async (project: CrmProject) => {
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
    if (projects) {
      mutateProjects(
        projects.map((p) =>
          p.id !== project.projectIds[0]
            ? p
            : { ...p, crmProjectIds: [...p.crmProjectIds, newProject.id] }
        )
      );
    }
    return newProject.id;
  };

  return { crmProject, errorCrmProject, loadingCrmProject, createCrmProject };
};

export default useCrmProject;
