import { type Schema } from "@/amplify/data/resource";
import { transformNotesVersion } from "@/components/ui-elements/notes-writer/NotesWriter";
import { generateClient } from "aws-amplify/data";
import { filter, flatten, flow, map } from "lodash/fp";
import useSWR from "swr";
import { Activity } from "./useActivity";
const client = generateClient<Schema>();

const mapActivity = ({
  id,
  notes,
  formatVersion,
  notesJson,
  meetingActivitiesId,
  finishedOn,
  createdAt,
  updatedAt,
}: Schema["Activity"]["type"]): Activity => ({
  id,
  notes: transformNotesVersion({ version: formatVersion, notes, notesJson }),
  meetingId: meetingActivitiesId || undefined,
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
  projectIds: [],
});

const fetchActivity = async (projAct: Schema["ProjectActivity"]["type"]) => {
  const { data, errors } = await client.models.Activity.get({
    id: projAct.activityId,
  });
  if (errors) throw errors;
  if (!data)
    throw new Error(
      `Error fetching activity with id ${projAct.activityId} from project with id ${projAct.projectsId}`
    );
  return mapActivity(data);
};

const fetchActivities = async (project: Schema["Projects"]["type"]) => {
  const { data, errors } =
    await client.models.ProjectActivity.listProjectActivityByProjectsId({
      projectsId: project.id,
    });
  if (errors) throw errors;
  if (!data)
    throw new Error(
      `Error fetching activities from project ${project.project} with id ${project.id}`
    );
  return await Promise.all(data.map(fetchActivity));
};

type ActivityProject = Omit<Activity, "projectIds"> & {
  projectId: string;
};

const fetchProject = async (
  accProj: Schema["AccountProjects"]["type"]
): Promise<Activity[] | undefined> => {
  const { data, errors } = await client.models.Projects.get({
    id: accProj.projectsId,
  });
  if (errors) throw errors;
  if (!data) throw new Error("Couldn't fetch projects from account");
  const activities = await fetchActivities(data);
  return activities.map((a) => ({ ...a, projectIds: [accProj.projectsId] }));
};

const fetchData =
  (accountId: string) => async (): Promise<ActivityProject[]> => {
    const { data, errors } =
      await client.models.AccountProjects.listAccountProjectsByAccountId({
        accountId,
      });
    if (errors) throw errors;
    if (!data)
      throw new Error(`Didn't receive projects from account ${accountId}`);
    const activities = await Promise.all(data.map(fetchProject));
    return flow(
      filter((a) => !!a),
      flatten,
      map(
        ({ projectIds, ...rest }: Activity): ActivityProject => ({
          ...rest,
          projectId: projectIds[0],
        })
      )
    )(activities);
  };

const useAccountActivities = (accountId: string) => {
  const { data: activities } = useSWR(
    `/api/projects/account/${accountId}`,
    fetchData(accountId)
  );
  return { activities };
};

export default useAccountActivities;
