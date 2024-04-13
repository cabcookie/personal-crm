import { type Schema } from "@/amplify/data/resource";
import { Context } from "@/contexts/ContextContext";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

const client = generateClient<Schema>();

export type Project = {
  id: string;
  project: string;
  context?: Context;
  done: boolean;
  doneOn?: Date;
  dueOn?: Date;
  accountIds?: string[];
};

export const mapProject: (project: Schema["Projects"]) => Project = ({
  id,
  project,
  done,
  doneOn,
  dueOn,
  context,
}) => ({
  id,
  project,
  done: !!done,
  doneOn: doneOn ? new Date(doneOn) : undefined,
  dueOn: dueOn ? new Date(dueOn) : undefined,
  context,
});

const fetchProject = (projectId?: string) => async () => {
  if (!projectId) return;
  const { data, errors } = await client.models.Projects.get(
    { id: projectId },
    {
      selectionSet: [
        "id",
        "project",
        "done",
        "doneOn",
        "dueOn",
        "onHoldTill",
        "myNextActions",
        "othersNextActions",
        "context",
        "accounts.account.id",
        "accounts.account.name",
        "activities.activity.id",
        "activities.activity.notes",
        "activities.activity.finishedOn",
        "activities.activity.createdAt",
        "activities.activity.updatedAt",
        "activities.activity.forMeeting.id",
      ],
    }
  );
  if (errors) throw errors;
  return mapProject(data);
};

const useProject = (projectId?: string) => {
  const {
    data: project,
    error: errorProject,
    isLoading: loadingProject,
  } = useSWR(`/api/projects/${projectId}`, fetchProject(projectId));

  return { project, errorProject, loadingProject };
};

export default useProject;
