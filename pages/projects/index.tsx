import { useProjectsContext } from "@/api/ContextProjects";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import ProjectName from "@/components/ui-elements/tokens/project-name";
import { useRouter } from "next/router";

const ProjectListPage = () => {
  const { projects, createProject } = useProjectsContext();
  const router = useRouter();

  const createAndOpenNewProject = async () => {
    const project = await createProject("New Project");
    if (!project) return;
    router.push(`/projects/${project.id}`);
  };

  return (
    <MainLayout
      title="Projects"
      sectionName="Projects"
      addButton={{ label: "New", onClick: createAndOpenNewProject }}
    >
      {!projects
        ? "Loading projects..."
        : projects.map((project) => (
            <div key={project.id}>
              <ProjectName projectId={project.id} />
              <ProjectDetails projectId={project.id} />
            </div>
          ))}
    </MainLayout>
  );
};

export default ProjectListPage;
