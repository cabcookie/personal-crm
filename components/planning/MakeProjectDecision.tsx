import { Project } from "@/api/ContextProjects";
import useWeekPlan from "@/api/useWeekPlan";
import { differenceInCalendarDays } from "date-fns";
import { FC } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type ProjectDecisionButtonProps = {
  selected: boolean;
  label: string;
  makeDecision: () => void;
};

const ProjectDecisionButton: FC<ProjectDecisionButtonProps> = ({
  selected,
  label,
  makeDecision,
}) => (
  <Button
    size="sm"
    onClick={makeDecision}
    variant={selected ? "default" : "outline"}
  >
    {label}
  </Button>
);

type MakeProjectDecisionProps = {
  startDate: Date;
  project: Project;
  isInFocus?: boolean;
  saveOnHoldDate: (onHoldTill: Date | null) => void;
};

const MakeProjectDecision: FC<MakeProjectDecisionProps> = ({
  isInFocus,
  startDate,
  project,
  saveOnHoldDate,
}) => {
  const { makeProjectDecision } = useWeekPlan();

  return (
    <div className="space-y-2">
      <ProjectAccordionItem project={project} />

      <div className="flex flex-col space-y-2">
        <Label htmlFor={`${project.id}-decision`} className="font-semibold">
          Can you make progress on this project this week?
        </Label>

        <div id={`${project.id}-decision`} className="space-x-2">
          <ProjectDecisionButton
            label="Yes"
            selected={!!isInFocus}
            makeDecision={() =>
              makeProjectDecision({
                inFocusThisWeek: true,
                project,
                saveOnHoldDate,
              })
            }
          />

          <ProjectDecisionButton
            label="No"
            selected={
              !!project.onHoldTill &&
              differenceInCalendarDays(project.onHoldTill, startDate) >= 7
            }
            makeDecision={() =>
              makeProjectDecision({
                inFocusThisWeek: false,
                project,
                saveOnHoldDate,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MakeProjectDecision;
