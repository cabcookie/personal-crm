import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  projectId: string;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

const createActivity = async () => {
  const { data, errors } = await client.models.Activity.create({});
  if (errors) handleApiErrors(errors, "Error creating activity");
  return data;
};

export const addProjectActivity = async ({
  data: { projectId },
  options,
}: Props) => {
  options?.mutate?.(false);
  const activity = await createActivity();
  if (!activity) return;
  const { errors } = await client.models.ProjectActivity.create({
    projectsId: projectId,
    activityId: activity.id,
  });
  if (errors) handleApiErrors(errors, "Error adding activity to project");
  options?.confirm?.();
  options?.mutate?.(true);
  return activity;
};
