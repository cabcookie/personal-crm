import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import useSWR from "swr";
import { Activity } from "@/components/activities/activity";
const client = generateClient<Schema>();

const selectionSet = [
  "activity.id",
  "activity.notes",
  "activity.finishedOn",
  "activity.createdAt",
  "activity.updatedAt",
  "activity.forMeeting.id",
] as const;

type ProjectActivitiesData = SelectionSet<
  Schema["ProjectActivity"],
  typeof selectionSet
>;

const mapProjectActivity = ({
  activity: { id, notes, finishedOn, createdAt, updatedAt, forMeeting },
}: ProjectActivitiesData): Activity => ({
  id,
  notes: notes || "",
  finishedOn: new Date(finishedOn || createdAt),
  updatedAt: new Date(updatedAt),
  meetingId: forMeeting.id,
});

const fetchProjectActivities = (projectId?: string) => async () => {
  if (!projectId) return;
  const { data, errors } = await client.models.ProjectActivity.list({
    filter: { projectsId: { eq: projectId } },
    limit: 200,
    selectionSet,
  });
  if (errors) throw errors;
  return data
    .map(mapProjectActivity)
    .sort((a, b) => b.finishedOn.getTime() - a.finishedOn.getTime());
};

const useProjectActivities = (projectId?: string) => {
  const {
    data: projectActivities,
    error: errorProjectActivity,
    isLoading: loadingProjectActivities,
    mutate: mutateProjectActivities,
  } = useSWR(
    `/api/projects/${projectId}/activities`,
    fetchProjectActivities(projectId)
  );

  const createProjectActivity = async (activityId: string, notes?: string) => {
    if (!projectId) return;
    const { data: activity, errors: errorsActivity } =
      await client.models.Activity.create({ id: activityId, notes });
    if (errorsActivity) {
      handleApiErrors(
        errorsActivity,
        "Error creating an activity for a project"
      );
      return;
    }
    const updated: Activity[] = [
      {
        id: activity.id,
        notes: "",
        finishedOn: new Date(activity.finishedOn || activity.createdAt),
        updatedAt: new Date(),
      },
      ...(projectActivities || []),
    ];
    mutateProjectActivities(updated, false);
    const { data, errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors)
      handleApiErrors(
        errors,
        "Error creating link between project and activity"
      );
    mutateProjectActivities(updated);
    return data.activityId;
  };

  const updateActivityNotes = async (notes: string, activityId: string) => {
    const updated: Activity[] =
      projectActivities?.map((activity) =>
        activity.id !== activityId ? activity : { ...activity, notes }
      ) || [];
    if (updated) mutateProjectActivities(updated, false);
    const { data, errors } = await client.models.Activity.update({
      id: activityId,
      notes,
    });
    if (errors) handleApiErrors(errors, "Error updating activitiy notes");
    if (updated) mutateProjectActivities(updated);
    return data.id;
  };

  return {
    projectActivities,
    errorProjectActivity,
    loadingProjectActivities,
    createProjectActivity,
    updateActivityNotes,
  };
};

export default useProjectActivities;
