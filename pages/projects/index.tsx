import { useProjectsContext } from "@/api/ContextProjects";
import MainLayout from "@/components/layouts/MainLayout";
import ButtonGroup from "@/components/ui-elements/btn-group/btn-group";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import ProjectName from "@/components/ui-elements/tokens/project-name";
import { isTodayOrFuture } from "@/helpers/functional";
import { useRouter } from "next/router";
import { useState } from "react";

const ProjectListPage = () => {
  const { projects, createProject } = useProjectsContext();
  const [filter, setFilter] = useState("WIP");
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
      <div className="bg-bgTransparent sticky top-[7rem] md:top-[8rem] z-[35] pb-2">
        <ButtonGroup
          values={["WIP", "On Hold", "Done"]}
          selectedValue={filter}
          onSelect={setFilter}
        />
      </div>
      {!projects
        ? "Loading projects..."
        : projects
            .filter(
              ({ done, onHoldTill }) =>
                (filter === "WIP" &&
                  !done &&
                  (!onHoldTill || !isTodayOrFuture(onHoldTill))) ||
                (filter === "On Hold" &&
                  !done &&
                  onHoldTill &&
                  isTodayOrFuture(onHoldTill)) ||
                (filter === "Done" && done)
            )
            .map((project) => (
              <div key={project.id}>
                <div className="text-lg md:text-xl font-bold pt-2 md:pt-4 tracking-tight bg-bgTransparent sticky top-[10rem] md:top-[11rem] z-30 pb-2">
                  <ProjectName projectId={project.id} />
                </div>
                <div className="text-sm md:text-base">
                  <ProjectDetails projectId={project.id} />
                </div>
              </div>
            ))}
    </MainLayout>
  );
};

export default ProjectListPage;
