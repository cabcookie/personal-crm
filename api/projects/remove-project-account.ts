import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  accountId: string;
  projectId: string;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

const getProjectAccountId = async (accountId: string, projectId: string) => {
  const { data, errors } = await client.models.Projects.get(
    { id: projectId },
    { selectionSet: ["accounts.id", "accounts.accountId"] }
  );
  if (errors) handleApiErrors(errors, "Error getting account/project link");
  return data?.accounts.find((p) => p.accountId === accountId)?.id;
};

export const removeProjectAccount = async ({
  data: { accountId, projectId },
  options,
}: Props) => {
  options?.mutate?.(false);
  const recordId = await getProjectAccountId(accountId, projectId);
  if (!recordId) return;
  const { errors } = await client.models.AccountProjects.delete({
    id: recordId,
  });
  if (errors) handleApiErrors(errors, "Error removing account from project");
  options?.confirm?.();
  options?.mutate?.(true);
};
