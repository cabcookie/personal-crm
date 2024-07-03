import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { getRevenue2Years } from "@/api/useCrmProjects";
import { isTodayOrFuture } from "@/helpers/functional";
import { filter, flow, get, map, sortBy, sum } from "lodash/fp";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";
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

type FilterProjectsProps = {
  projects?: Project[];
  accountId?: string;
  filter?: ProjectFilters;
  accounts?: Account[];
};

const filterAccounts = (project: Project) => (account: Account) =>
  project.accountIds.includes(account.id);

const calcPriority = (accounts?: Account[]) => (project: Project) => ({
  ...project,
  priority:
    flow(filter(filterAccounts(project)), map(get("priority")), sum)(accounts) *
      10 +
    project.priority,
});

const filterProject =
  ({ filter, accountId }: FilterProjectsProps) =>
  ({ accountIds, done, onHoldTill }: Project) =>
    accountId
      ? accountIds.includes(accountId)
      : (filter === "WIP" &&
          !done &&
          (!onHoldTill || !isTodayOrFuture(onHoldTill))) ||
        (filter === "On Hold" &&
          !done &&
          onHoldTill &&
          isTodayOrFuture(onHoldTill)) ||
        (filter === "Done" && done);

const filterProjects = ({
  projects,
  filter: statusFilter,
  accountId,
  accounts,
}: FilterProjectsProps) =>
  flow(
    filter(filterProject({ accountId, filter: statusFilter })),
    map(calcPriority(accounts)),
    sortBy((p) => -p.priority)
  )(projects);

const ProjectList: FC<ProjectListProps> = ({ accountId, filter }) => {
  const { projects } = useProjectsContext();
  const { accounts, getAccountById } = useAccountsContext();
  const [items, setItems] = useState<Project[] | undefined>(
    filterProjects({ projects, accountId, filter, accounts })
  );
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  useEffect(
    () => setItems(filterProjects({ projects, accountId, filter, accounts })),
    [accountId, projects, filter, accounts]
  );

  return !items ? (
    "Loading…"
  ) : items.length === 0 ? (
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
      {items.map(({ id: projectId, project, accountIds, crmProjects }) => (
        <DefaultAccordionItem
          key={projectId}
          value={projectId}
          triggerTitle={project}
          className="tracking-tight"
          accordionSelectedValue={accordionValue}
          link={`/projects/${projectId}`}
          triggerSubTitle={
            <>
              {accountIds.map((id: string) => (
                <Link
                  key={id}
                  className="hover:underline truncate"
                  href={`/accounts/${id}`}
                >
                  {getAccountById(id)?.name}
                </Link>
              ))}
              {crmProjects.length > 0 && (
                <div className="truncate">{getRevenue2Years(crmProjects)}</div>
              )}
            </>
          }
        >
          <ProjectDetails
            projectId={projectId}
            showCrmDetails
            includeAccounts
          />
        </DefaultAccordionItem>
      ))}
    </Accordion>
  );
};

export default ProjectList;
