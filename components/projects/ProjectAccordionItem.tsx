import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useProjectTodos from "@/api/useProjectTodos";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { addDays, format } from "date-fns";
import { flow, map, sum } from "lodash/fp";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import ActivityFormatBadge from "../activities/activity-format-badge";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";
import { Button } from "../ui/button";

type ProjectAccordionItemProps = {
  project?: Project;
  showNotes?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
  allowPushToNextDay?: boolean;
};

const ProjectAccordionItem: FC<ProjectAccordionItemProps> = ({
  project,
  onDelete,
  disabled,
  allowPushToNextDay,
  showNotes = true,
}) => {
  const [pushingInProgress, setPushingInProgress] = useState(false);
  const { saveProjectDates } = useProjectsContext();
  const { getAccountNamesByIds } = useAccountsContext();
  const { projectTodos } = useProjectTodos(project?.id);

  const handlePushToNextDay = async () => {
    if (!project) return;
    setPushingInProgress(true);
    const result = await saveProjectDates({
      projectId: project.id,
      onHoldTill: addDays(new Date(), 1),
    });
    if (result) return;
    setPushingInProgress(false);
  };

  return (
    project && (
      <DefaultAccordionItem
        value={project.id}
        triggerTitle={project.project}
        className="tracking-tight"
        onDelete={onDelete}
        link={`/projects/${project.id}`}
        badge={
          <>
            <TaskBadge hasOpenTasks={projectTodos && projectTodos.length > 0} />
            {project.hasOldVersionedActivityFormat && <ActivityFormatBadge />}
          </>
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
        {allowPushToNextDay && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePushToNextDay}
            disabled={pushingInProgress}
          >
            {!pushingInProgress && (
              <ArrowRightCircle className="w-4 h-4 mr-1" />
            )}
            {pushingInProgress && (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            )}
            Push to next day
          </Button>
        )}

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
