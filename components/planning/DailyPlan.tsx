import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import { useTodosProjects } from "@/helpers/useTodosProjects";
import { format } from "date-fns";
import { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import DailyPlanProject from "./DailyPlanProject";

type DailyPlanComponentProps = {
  dailyPlan: DailyPlan;
};

const DailyPlanComponent: FC<DailyPlanComponentProps> = ({
  dailyPlan: { id: dailyPlanId, status, day, dayGoal, todos },
}) => {
  const projects = useTodosProjects(todos);
  const { finishDailyTaskList } = useDailyPlans("OPEN");

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-start gap-3 sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent">
        <Checkbox
          checked={status === "DONE"}
          onCheckedChange={() => finishDailyTaskList(dailyPlanId)}
          className="mt-[0.3rem] md:mt-[0.4rem]"
        />
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {dayGoal} – {format(day, "PPP")}
        </h2>
      </div>

      <DailyPlanProject className="ml-7" projects={projects} todos={todos} />
    </div>
  );
};

export default DailyPlanComponent;
