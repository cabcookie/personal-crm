import { Project, useProjectsContext } from "@/api/ContextProjects";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const { getProjectById, updateProjectState } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [getProjectById, projectId]);

  const handleBackBtnClick = () => {
    router.push("/projects");
  };

  return (
    <MainLayout
      title={project?.project}
      recordName={project?.project}
      sectionName="Projects"
      onBackBtnClick={handleBackBtnClick}
      addButton={{
        label: project?.done ? "Set open" : "Set done",
        onClick: () => project && updateProjectState(project.id, !project.done),
      }}
    >
      {!project ? (
        "Loading project..."
      ) : (
        <div>
          {projectId && (
            <ProjectDetails
              projectId={projectId}
              includeAccounts
              showContext
              showCrmDetails
              showNotes
            />
          )}
        </div>
      )}
    </MainLayout>
  );
};
export default ProjectDetailPage;
