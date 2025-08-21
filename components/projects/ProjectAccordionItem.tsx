import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { calcRevenueTwoYears, make2YearsRevenueText } from "@/helpers/projects";
import { format } from "date-fns";
import { flow, map, sum } from "lodash/fp";
import { Pin, PinOff } from "lucide-react";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectDetails from "../ui-elements/project-details/project-details";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ProjectAccordionItemProps = {
  project?: Project;
  showNotes?: boolean;
  showPin?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
  disableOrderControls?: boolean;
  onMoveUp?: (projectId: string) => Promise<string | undefined>;
  onMoveDown?: (projectId: string) => Promise<string | undefined>;
};

const ProjectAccordionItem: FC<ProjectAccordionItemProps> = ({
  project,
  onDelete,
  disabled,
  showNotes = true,
  showPin = false,
  disableOrderControls = false,
  onMoveUp,
  onMoveDown,
}) => {
  const { getAccountNamesByIds } = useAccountsContext();
  const {
    moveProjectUp: globalMoveProjectUp,
    moveProjectDown: globalMoveProjectDown,
    togglePinProject,
  } = useProjectsContext();
  const [isPinHovered, setIsPinHovered] = useState(false);

  // Use custom move functions if provided, otherwise fallback to global context functions
  const moveProjectUp = onMoveUp || globalMoveProjectUp;
  const moveProjectDown = onMoveDown || globalMoveProjectDown;

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project) {
      togglePinProject(project.id);
    }
  };

  return (
    project && (
      <DefaultAccordionItem
        value={project.id}
        triggerTitle={project.project}
        className="tracking-tight"
        onDelete={onDelete}
        link={`/projects/${project.id}`}
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
        actionIcon={
          showPin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePinClick}
              onMouseEnter={() => setIsPinHovered(true)}
              onMouseLeave={() => setIsPinHovered(false)}
              aria-label={
                project.pinned === "PINNED" ? "Unpin project" : "Pin project"
              }
              className={cn(
                "h-5 w-5 mt-1 text-muted-foreground",
                project.pinned === "NOTPINNED" && "hidden group-hover:block"
              )}
              asChild
            >
              {project.pinned === "PINNED" ? (
                isPinHovered ? (
                  <PinOff />
                ) : (
                  <Pin />
                )
              ) : isPinHovered ? (
                <Pin />
              ) : (
                <PinOff />
              )}
            </Button>
          )
        }
        disabled={disabled}
        disableOrderControls={disableOrderControls}
        onMoveUp={() => moveProjectUp(project.id)}
        onMoveDown={() => moveProjectDown(project.id)}
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
