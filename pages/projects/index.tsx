import { useProjectsContext } from "@/api/ContextProjects";
import ProjectList from "@/components/accounts/ProjectList";
import MainLayout from "@/components/layouts/MainLayout";
import ProjectFilterBtnGrp from "@/components/projects/project-filter-btn-group";
import {
  useProjectFilter,
  withProjectFilter,
} from "@/components/projects/useProjectFilter";
import SearchInput from "@/components/search/search-input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const ProjectListPage = () => {
  const { createProject } = useProjectsContext();
  const { isSearchActive } = useProjectFilter();
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
      <div className="space-y-6">
        <SearchInput
          className={cn(
            "py-4",
            isSearchActive &&
              "bg-bgTransparent sticky top-[6.5rem] md:top-[8.25rem] z-[35] pb-2"
          )}
        />

        <ProjectFilterBtnGrp className="bg-bgTransparent sticky top-[7rem] md:top-[8rem] z-[35] pb-2" />

        <ProjectList />
      </div>
    </MainLayout>
  );
};

export default withProjectFilter(ProjectListPage);
