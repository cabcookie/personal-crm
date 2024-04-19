import { Project, useProjectsContext } from "@/api/ContextProjects";
import useProjectActivities from "@/api/useProjectActivities";
import ActivityComponent, { Activity } from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import AccountName from "@/components/ui-elements/tokens/account-name";
import { toLocaleDateString } from "@/helpers/functional";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const { getProjectById, loadingProjects } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const { projectActivities, createProjectActivity, updateActivityNotes } =
    useProjectActivities(projectId);
  const [newActivity, setNewActivity] = useState<Activity>({
    id: crypto.randomUUID(),
    notes: "",
    finishedOn: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [getProjectById, projectId]);

  const saveNewActivity = async (notes?: string) => {
    const data = await createProjectActivity(newActivity.id, notes);
    setNewActivity({
      id: crypto.randomUUID(),
      notes: "",
      finishedOn: new Date(),
      updatedAt: new Date(),
    });
    return data;
  };

  return (
    <MainLayout
      title={project?.project}
      recordName={project?.project}
      sectionName="Projects"
    >
      {loadingProjects && "Loading project..."}
      {project?.dueOn && <div>Due On: {toLocaleDateString(project.dueOn)}</div>}
      {project?.doneOn && (
        <div>Done On: {toLocaleDateString(project.doneOn)}</div>
      )}
      {project?.accountIds.map((accountId) => (
        <AccountName key={accountId} accountId={accountId} />
      ))}
      {[
        newActivity,
        ...(projectActivities?.filter(({ id }) => id !== newActivity.id) || []),
      ].map((activity) => (
        <ActivityComponent
          key={activity.id}
          activity={activity}
          showDates
          showMeeting
          createActivity={
            activity.id === newActivity.id ? saveNewActivity : undefined
          }
          updateActivityNotes={updateActivityNotes}
        />
      ))}
    </MainLayout>
  );
};
export default ProjectDetailPage;
