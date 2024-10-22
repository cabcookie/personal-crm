import { Project } from "@/api/ContextProjects";
import useWeekPlan from "@/api/useWeekPlan";
import { isDeselectedForWeek, isSelectedForWeek } from "@/helpers/planning";
import { cn } from "@/lib/utils";
import { FC, useEffect, useState } from "react";
import { Label } from "../ui/label";
import DecisionButton from "./DecisionButton";

type DecisionSectionProps = {
  project: Project;
  className?: string;
  saveOnHoldDate: (onHoldTill: Date | null) => void;
};

const DecisionSection: FC<DecisionSectionProps> = ({
  project,
  className,
  saveOnHoldDate,
}) => {
  const { makeProjectDecision, weekPlan } = useWeekPlan();
  const [selectedChoice, setSelectedChoice] = useState("");

  useEffect(() => {
    if (!weekPlan) return;
    if (
      isSelectedForWeek(weekPlan, project) ||
      isDeselectedForWeek(weekPlan, project)
    )
      setSelectedChoice("");
  }, [weekPlan, project]);

  const handleDecision = (inFocusThisWeek: boolean, choice: string) => () => {
    setSelectedChoice(choice);
    makeProjectDecision({ inFocusThisWeek, project, saveOnHoldDate });
  };

  return (
    weekPlan && (
      <div className={cn(className)}>
        <Label htmlFor={`${project.id}-decision`} className="font-semibold">
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
