import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import { filterAndSortProjects } from "@/helpers/projects";
import { FC, useState } from "react";
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
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return !projects ? (
    "Loading…"
  ) : filterAndSortProjects(projects, accountId, projectFilter, accounts)
      .length === 0 ? (
    "No projects"
  ) : (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={(val) =>
        setAccordionValue(val === accordionValue ? undefined : val)
      }
    >
      {filterAndSortProjects(projects, accountId, projectFilter, accounts).map(
        (project) => (
          <ProjectAccordionItem
            key={project.id}
            project={project}
            accordionSelectedValue={accordionValue}
          />
        )
      )}
    </Accordion>
  );
};

export default ProjectList;
