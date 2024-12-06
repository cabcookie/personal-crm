import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  projectId: string;
  crmProjectId: string;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

const getProjectCrmProjectId = async (
  projectId: string,
  crmProjectId: string
) => {
  const { data, errors } = await client.models.CrmProject.get(
    { id: crmProjectId },
    { selectionSet: ["projects.id", "projects.projectId"] }
  );
  if (errors) handleApiErrors(errors, "Error getting CRM Project/Project link");
  return data?.projects.find((p) => p.projectId === projectId)?.id;
};

export const removeProjectCrmProject = async ({
  data: { projectId, crmProjectId },
  options,
}: Props) => {
  options?.mutate?.(false);
  const recordId = await getProjectCrmProjectId(projectId, crmProjectId);
  if (!recordId) return;
  const { data, errors } = await client.models.CrmProjectProjects.delete({
    id: recordId,
  });
  if (errors) handleApiErrors(errors, "Error updating CRM Project");
  options?.confirm?.();
  options?.mutate?.(true);
  return data;
};
