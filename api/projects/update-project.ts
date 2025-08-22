import { CrudOptions, handleApiErrors } from "../globals";
import { client } from "@/lib/amplify";

type UpdateProjectInput = Parameters<typeof client.models.Projects.update>[0];

interface Props {
  data: UpdateProjectInput;
  options?: CrudOptions;
}

export const updateProject = async ({ data: input, options }: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.Projects.update(input);
  if (errors) handleApiErrors(errors, "Error updating Project");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
