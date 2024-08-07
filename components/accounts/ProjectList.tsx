import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filterAndSortProjects } from "@/helpers/projects";
import { flow, identity, map, times } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import ApiLoadingError from "../layouts/ApiLoadingError";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
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
type ProjectListProps = (ProjectsByAccount | ProjectsByFilter) & {
  allowPushToNextDay?: boolean;
};

const ProjectList: FC<ProjectListProps> = ({
  accountId,
  filter: projectFilter,
  allowPushToNextDay,
}) => {
  const { projects, loadingProjects, errorProjects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!projects) return setFilteredProjects([]);
    setFilteredProjects(
      filterAndSortProjects(projects, accountId, projectFilter, accounts)
    );
  }, [accountId, accounts, projectFilter, projects]);

  return (
    <div className="space-y-4">
      <ApiLoadingError title="Loading projects failed" error={errorProjects} />

      {!loadingProjects && filteredProjects.length === 0 && (
        <div className="text-muted-foreground text-sm font-semibold">
          No projects
        </div>
      )}

      <Accordion type="single" collapsible>
        {loadingProjects &&
          flow(
            times(identity),
            map((id: number) => (
              <LoadingAccordionItem
                key={id}
                value={`loading-${id}`}
                sizeTitle="lg"
                sizeSubtitle="base"
              />
            ))
          )(10)}

        {filteredProjects.map((project) => (
          <ProjectAccordionItem
            key={project.id}
            project={project}
            allowPushToNextDay={allowPushToNextDay}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ProjectList;
