import { type Schema } from "@/amplify/data/resource";
import { newDateTimeString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "../globals";
const client = generateClient<Schema>();

export const createActivityApi = async () => {
  const { data, errors } = await client.models.Activity.create({
    formatVersion: 3,
    noteBlockIds: [],
    finishedOn: newDateTimeString(),
    notes: null,
    notesJson: null,
  });
  if (errors) {
    handleApiErrors(errors, "Error creating activity");
    return;
  }
  return data;
};

export const updateActivityBlockIds = async (
  activityId: string,
  blockIds: string[]
) => {
  const { data, errors } = await client.models.Activity.update({
    id: activityId,
    noteBlockIds: blockIds,
  });
  if (errors)
    handleApiErrors(errors, "Error updating linked blocks on activity");
  return data;
};

export const createProjectActivityApi = async (
  projectsId: string,
  activityId: string
) => {
  const { data, errors } = await client.models.ProjectActivity.create({
    activityId,
    projectsId,
  });
  if (errors) handleApiErrors(errors, "Error linking activity with project");
  return data;
};
