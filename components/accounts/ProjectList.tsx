import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import {
  calcRevenueTwoYears,
  filterAndSortProjects,
  make2YearsRevenueText,
} from "@/helpers/projects";
import { format } from "date-fns";
import { flow, get, map, sum } from "lodash/fp";
import { FC, useState } from "react";
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

const ProjectList: FC<ProjectListProps> = ({
  accountId,
  filter: projectFilter,
}) => {
  const { projects } = useProjectsContext();
  const { accounts, getAccountById } = useAccountsContext();
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
        ({
          id: projectId,
          project,
          accountIds,
          crmProjects,
          doneOn,
          dueOn,
          onHoldTill,
        }) => (
          <DefaultAccordionItem
            key={projectId}
            value={projectId}
            triggerTitle={project}
            className="tracking-tight"
            accordionSelectedValue={accordionValue}
            link={`/projects/${projectId}`}
            triggerSubTitle={[
              doneOn && `Done on: ${format(doneOn, "PPP")}`,
              onHoldTill &&
                !doneOn &&
                `On hold till: ${format(onHoldTill, "PPP")}`,
              flow(
                map(calcRevenueTwoYears),
                sum,
                make2YearsRevenueText
              )(crmProjects),
              dueOn && !doneOn && `Due on: ${format(dueOn, "PPP")}`,
              ...flow(map(getAccountById), map(get("name")))(accountIds),
            ]}
          >
            <ProjectDetails
              projectId={projectId}
              showCrmDetails
              includeAccounts
            />
          </DefaultAccordionItem>
        )
      )}
    </Accordion>
  );
};

export default ProjectList;
