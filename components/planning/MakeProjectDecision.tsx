import { Project } from "@/api/ContextProjects";
import useWeekPlan from "@/api/useWeekPlan";
import { differenceInCalendarDays } from "date-fns";
import { FC, useState } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { Label } from "../ui/label";
import DecisionButton from "./DecisionButton";

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
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleDecision = (inFocusThisWeek: boolean, choice: string) => () => {
    setSelectedChoice(choice);
    makeProjectDecision({ inFocusThisWeek, project, saveOnHoldDate });
  };

  return (
    <div className="space-y-2">
      <ProjectAccordionItem project={project} />

      <div className="flex flex-col space-y-2">
        <Label htmlFor={`${project.id}-decision`} className="font-semibold">
          Can you make progress on this project this week?
        </Label>

        <div id={`${project.id}-decision`} className="space-x-2">
          <DecisionButton
            label="Yes"
            selected={!!isInFocus}
            makeDecision={handleDecision(true, "Yes")}
            isLoading={selectedChoice === "Yes"}
            disabled={selectedChoice !== ""}
          />

          <DecisionButton
            label="No"
            selected={
              !!project.onHoldTill &&
              differenceInCalendarDays(project.onHoldTill, startDate) >= 7
            }
            makeDecision={handleDecision(false, "No")}
            isLoading={selectedChoice === "No"}
            disabled={selectedChoice !== ""}
          />
        </div>
      </div>
    </div>
  );
};

export default MakeProjectDecision;
