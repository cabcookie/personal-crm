import { Project, useProjectsContext } from "@/api/ContextProjects";
import ActivityComponent from "@/components/activities/activity";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const { getProjectById, createProjectActivity } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [newActivityId, setNewActivityId] = useState(crypto.randomUUID());
  const [autoFocusActivityId, setAutoFocusActivitiyId] = useState("");

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [getProjectById, projectId]);

  const saveNewActivity = async (notes?: string) => {
    if (!projectId) return;
    console.log("saveNewActivity", { notes });
    const data = await createProjectActivity(projectId, notes);
    setNewActivityId(crypto.randomUUID());
    setAutoFocusActivitiyId(data || "");
    return data;
  };

  useEffect(() => {
    if (autoFocusActivityId.length > 5) {
      setTimeout(() => {
        setAutoFocusActivitiyId("");
      }, 2000);
    }
  }, [autoFocusActivityId]);

  return (
    <MainLayout
      title={project?.project}
      recordName={project?.project}
      sectionName="Projects"
    >
      {!project ? (
        "Loading project..."
      ) : (
        <div>
          {projectId && <ProjectDetails projectId={projectId} />}
          {[newActivityId, ...(project?.activityIds || [])].map((id) => (
            <ActivityComponent
              key={id}
              activityId={id}
              showDates
              showMeeting
              autoFocus={id === autoFocusActivityId}
              createActivity={
                id === newActivityId ? saveNewActivity : undefined
              }
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};
export default ProjectDetailPage;
