import { useAccountsContext } from "@/api/ContextAccounts";
import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Project } from "@/api/ContextProjects";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { format } from "date-fns";
import { flow, get, map, sum } from "lodash/fp";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";

type ProjectAccordionItemProps = {
  project?: Project;
  showNotes?: boolean;
  onDelete?: () => void;
};

const ProjectAccordionItem: FC<ProjectAccordionItemProps> = ({
  project,
  onDelete,
  showNotes = true,
}) => {
  const { getAccountById } = useAccountsContext();
  const { openTasksByProjectId } = useOpenTasksContext();

  return (
    project && (
      <DefaultAccordionItem
        value={project.id}
        triggerTitle={project.project}
        className="tracking-tight"
        onDelete={onDelete}
        link={`/projects/${project.id}`}
        hasOpenTasks={openTasksByProjectId(project.id).length > 0}
        triggerSubTitle={[
          project.doneOn && `Done on: ${format(project.doneOn, "PPP")}`,
          project.onHoldTill &&
            !project.doneOn &&
            `On hold till: ${format(project.onHoldTill, "PPP")}`,
          flow(
            map(calcRevenueTwoYears),
            sum,
            make2YearsRevenueText
          )(project.crmProjects),
          project.dueOn &&
            !project.doneOn &&
            `Due on: ${format(project.dueOn, "PPP")}`,
          ...flow(map(getAccountById), map(get("name")))(project.accountIds),
        ]}
      >
        <ProjectDetails
          projectId={project.id}
          showCrmDetails
          includeAccounts
          showNotes={showNotes}
        />
      </DefaultAccordionItem>
    )
  );
};

export default ProjectAccordionItem;
