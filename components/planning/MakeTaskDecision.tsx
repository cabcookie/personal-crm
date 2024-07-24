import { OpenTask } from "@/api/ContextOpenTasks";
import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import { FC, useState } from "react";
import NextAction from "../ui-elements/project-details/next-action";
import DecisionButton from "./DecisionButton";

const isSelected = (
  dailyPlan: DailyPlan,
  openTask: OpenTask,
  option: boolean
) =>
  dailyPlan.tasks.find(
    (t) => t.activityId === openTask.activityId && t.index === openTask.index
  )?.isInFocus === option;

type MakeTaskDecisionProps = {
  dailyPlan: DailyPlan;
  openTask: OpenTask;
};

const MakeTaskDecision: FC<MakeTaskDecisionProps> = ({
  dailyPlan,
  openTask,
}) => {
  const { makeTaskDecision } = useDailyPlans("PLANNING");
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleDecision = (isInFocus: boolean, choice: string) => async () => {
    setSelectedChoice(choice);
    await makeTaskDecision(openTask, dailyPlan.id, isInFocus);
    setSelectedChoice("");
  };

  return (
    <div className="space-y-2">
      <NextAction openTask={openTask} showProjects={false} />
      <div className="space-x-2">
        <DecisionButton
          label="To Daily Task List"
          selected={isSelected(dailyPlan, openTask, true)}
          makeDecision={handleDecision(true, "To Daily Task List")}
          isLoading={selectedChoice === "To Daily Task List"}
          disabled={selectedChoice !== ""}
        />

        <DecisionButton
          label="Ignore"
          selected={isSelected(dailyPlan, openTask, false)}
          makeDecision={handleDecision(false, "Ignore")}
          isLoading={selectedChoice === "Ignore"}
          disabled={selectedChoice !== ""}
        />
      </div>
    </div>
  );
};

export default MakeTaskDecision;
