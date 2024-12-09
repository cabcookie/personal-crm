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

export const addProjectCrmProject = async ({
  data: { projectId, crmProjectId },
  options,
}: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.CrmProjectProjects.create({
    projectId,
    crmProjectId,
  });
  if (errors) handleApiErrors(errors, "Error updating CRM Project");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
