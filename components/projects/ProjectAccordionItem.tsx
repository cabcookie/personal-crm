import { useAccountsContext } from "@/api/ContextAccounts";
import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Project } from "@/api/ContextProjects";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { format } from "date-fns";
import { flow, map, sum } from "lodash/fp";
import { FC } from "react";
import HygieneIssueBadge from "../crm/hygiene-issue-badge";
import { hasHygieneIssues } from "../crm/pipeline-hygiene";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";

type ProjectAccordionItemProps = {
  project?: Project;
  showNotes?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
};

const ProjectAccordionItem: FC<ProjectAccordionItemProps> = ({
  project,
  onDelete,
  disabled,
  showNotes = true,
}) => {
  const { getAccountNamesByIds } = useAccountsContext();
  const { openTasksByProjectId } = useOpenTasksContext();

  return (
    project && (
      <DefaultAccordionItem
        value={project.id}
        triggerTitle={project.project}
        className="tracking-tight"
        onDelete={onDelete}
        link={`/projects/${project.id}`}
        badge={
          project.crmProjects.some(hasHygieneIssues) ? (
            <HygieneIssueBadge />
          ) : (
            <TaskBadge
              hasOpenTasks={openTasksByProjectId(project.id).length > 0}
              hasClosedTasks={false}
            />
          )
        }
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
          getAccountNamesByIds(project.accountIds),
          project.partnerId &&
            `Partner: ${getAccountNamesByIds([project.partnerId])}`,
        ]}
        disabled={disabled}
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
