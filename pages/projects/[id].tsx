import { Project, useProjectsContext } from "@/api/ContextProjects";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import { debouncedUpdateProjectDetails } from "@/components/ui-elements/project-details/project-updates-helpers";
import SavedState from "@/components/ui-elements/project-notes-form/saved-state";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ProjectDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const { getProjectById, saveProjectName, updateProjectState } =
    useProjectsContext();
  const [project, setProject] = useState<Project | undefined>(
    projectId ? getProjectById(projectId) : undefined
  );
  const [projectDetailsSaved, setProjectDetailsSaved] = useState(true);

  useEffect(() => {
    if (projectId) {
      setProject(getProjectById(projectId));
    }
  }, [getProjectById, projectId]);

  const handleBackBtnClick = () => {
    router.push("/projects");
  };

  const updateProjectName = (newName: string) => {
    if (!project) return;
    if (newName.trim() === project.project.trim()) return;
    setProjectDetailsSaved(false);
    debouncedUpdateProjectDetails({
      id: project.id,
      project: newName,
      setSaveStatus: setProjectDetailsSaved,
      updateProjectFn: ({ id, project }) => saveProjectName(id, project || ""),
    });
  };

  return (
    <MainLayout
      title={project?.project}
      recordName={project?.project}
      sectionName="Projects"
      onBackBtnClick={handleBackBtnClick}
      onTitleChange={() => setProjectDetailsSaved(false)}
      saveTitle={updateProjectName}
      addButton={{
        label: project?.done ? "Set open" : "Set done",
        onClick: () => project && updateProjectState(project.id, !project.done),
      }}
    >
      {!project ? (
        "Loading project..."
      ) : (
        <div>
          <SavedState saved={projectDetailsSaved} />
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
