import { useProjectsContext } from "@/api/ContextProjects";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectDetails from "@/components/ui-elements/project-details/project-details";
import SelectionSlider from "@/components/ui-elements/selection-slider/selection-slider";
import ProjectName from "@/components/ui-elements/tokens/project-name";
import { isTodayOrFuture } from "@/helpers/functional";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./ProjectList.module.css";

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
      <div className={styles.filter}>
        <SelectionSlider
          valueList={["WIP", "On Hold", "Done"]}
          value={filter}
          onChange={setFilter}
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
                <ProjectName projectId={project.id} />
                <ProjectDetails projectId={project.id} />
              </div>
            ))}
    </MainLayout>
  );
};

export default ProjectListPage;
