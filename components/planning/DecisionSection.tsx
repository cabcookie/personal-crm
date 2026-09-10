import useWeekPlan from "@/api/useWeekPlan";
import { isDeselectedForWeek, isSelectedForWeek } from "@/helpers/planning";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Label } from "../ui/label";
import DecisionButton from "./DecisionButton";

interface Project {
  id: string;
  onHoldTill?: Date | null;
}

interface DecisionSectionProps {
  project: Project;
  className?: string;
  saveOnHoldDate: (onHoldTill: Date | null) => void;
}

const DecisionSection: FC<DecisionSectionProps> = ({
  project,
  className,
  saveOnHoldDate,
}) => {
  const { makeProjectDecision, weekPlan } = useWeekPlan();
  const [selectedChoice, setSelectedChoice] = useState("");
  const [lastInputs, setLastInputs] = useState({ weekPlan, project });

  // Clears the pending indicator once the plan reflects the decision. Keyed on
  // the same inputs the effect watched, so the timing is unchanged -- only the
  // extra render pass is gone.
  if (lastInputs.weekPlan !== weekPlan || lastInputs.project !== project) {
    setLastInputs({ weekPlan, project });
    if (
      weekPlan &&
      (isSelectedForWeek(weekPlan, project) ||
        isDeselectedForWeek(weekPlan, project))
    )
      setSelectedChoice("");
  }

  const handleDecision = (inFocusThisWeek: boolean, choice: string) => () => {
    setSelectedChoice(choice);
    makeProjectDecision({ inFocusThisWeek, project, saveOnHoldDate });
  };

  return (
    weekPlan && (
      <div className={cn(className)}>
        <Label htmlFor={`${project.id}-decision`}>
          Can you make progress on this project this week?
        </Label>

        <div id={`${project.id}-decision`} className="space-x-2">
          <DecisionButton
            label="Yes"
            selected={isSelectedForWeek(weekPlan, project)}
            makeDecision={handleDecision(true, "Yes")}
            isLoading={selectedChoice === "Yes"}
            disabled={selectedChoice !== ""}
          />

          <DecisionButton
            label="No"
            selected={isDeselectedForWeek(weekPlan, project)}
            makeDecision={handleDecision(false, "No")}
            isLoading={selectedChoice === "No"}
            disabled={selectedChoice !== ""}
          />
        </div>
      </div>
    )
  );
};

export default DecisionSection;
