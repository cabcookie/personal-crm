import { useProjectsContext } from "@/api/ContextProjects";
import ProjectList, {
  ProjectFilters,
  isValidProjectFilter,
} from "@/components/accounts/ProjectList";
import MainLayout from "@/components/layouts/MainLayout";
import ButtonGroup from "@/components/ui-elements/btn-group/btn-group";
import { Accordion } from "@/components/ui/accordion";
import { useRouter } from "next/router";
import { useState } from "react";

const ProjectListPage = () => {
  const { projects, createProject } = useProjectsContext();
  const [filter, setFilter] = useState<ProjectFilters>("WIP");
  const router = useRouter();

  const createAndOpenNewProject = async () => {
    const project = await createProject("New Project");
    if (!project) return;
    router.replace(`/projects/${project.id}`);
  };

  const onFilterChange = (newFilter: string) =>
    isValidProjectFilter(newFilter) && setFilter(newFilter);

  return (
    <MainLayout
      title="Projects"
      sectionName="Projects"
      addButton={{ label: "New", onClick: createAndOpenNewProject }}
    >
      <div className="bg-bgTransparent sticky top-[7rem] md:top-[8rem] z-[35] pb-2">
        <ButtonGroup
          values={["WIP", "On Hold", "Done"] as ProjectFilters[]}
          selectedValue={filter}
          onSelect={onFilterChange}
        />
      </div>
      {!projects ? (
        "Loading projects…"
      ) : (
        <Accordion type="single" collapsible>
          <ProjectList filter={filter} />
        </Accordion>
      )}
    </MainLayout>
  );
};

export default ProjectListPage;
