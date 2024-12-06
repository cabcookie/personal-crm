import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

type UpdateProjectInput = Parameters<typeof client.models.Projects.update>[0];

interface Props {
  data: UpdateProjectInput;
  options?: CrudOptions;
}

export const updateProject = async ({ data, options }: Props) => {
  options?.mutate?.(false);
  const { errors } = await client.models.Projects.update(data);
  if (errors) handleApiErrors(errors, "Error updating Project");
  options?.confirm?.();
  options?.mutate?.(true);
};
