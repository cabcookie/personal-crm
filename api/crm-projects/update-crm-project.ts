import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

type DataProps = Parameters<typeof client.models.CrmProject.update>[0];

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

export const updateCrmProject = async ({ data: input, options }: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.CrmProject.update(input);
  if (errors) handleApiErrors(errors, "Error updating CRM Project");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
