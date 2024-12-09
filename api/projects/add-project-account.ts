import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  projectId: string;
  accountId: string;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

export const addProjectAccount = async ({
  data: { projectId, accountId },
  options,
}: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.AccountProjects.create({
    projectsId: projectId,
    accountId,
  });
  if (errors) handleApiErrors(errors, "Error adding account to project");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
