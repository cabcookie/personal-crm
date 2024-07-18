import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import { filterAndSortProjects } from "@/helpers/projects";
import { FC } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { Accordion } from "../ui/accordion";

const PROJECT_FILTERS = ["WIP", "On Hold", "Done"] as const;
export type ProjectFilters = (typeof PROJECT_FILTERS)[number];
export const isValidProjectFilter = (
  filter: string
): filter is ProjectFilters =>
  PROJECT_FILTERS.includes(filter as ProjectFilters);

type ProjectsByAccount = {
  accountId: string;
  filter?: never;
};
type ProjectsByFilter = {
  accountId?: never;
  filter: ProjectFilters;
};
type ProjectListProps = ProjectsByAccount | ProjectsByFilter;

const ProjectList: FC<ProjectListProps> = ({
  accountId,
  filter: projectFilter,
}) => {
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();

  return !projects ? (
    "Loading…"
  ) : filterAndSortProjects(projects, accountId, projectFilter, accounts)
      .length === 0 ? (
    "No projects"
  ) : (
    <Accordion type="single" collapsible>
      {filterAndSortProjects(projects, accountId, projectFilter, accounts).map(
        (project) => (
          <ProjectAccordionItem key={project.id} project={project} />
        )
      )}
    </Accordion>
  );
};

export default ProjectList;
