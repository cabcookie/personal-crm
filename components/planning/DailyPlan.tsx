import useDailyPlans, { DailyPlan, DailyPlanTodo } from "@/api/useDailyPlans";
import { transformTaskType } from "@/helpers/planning";
import { format } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import Task from "./Task";

type DailyPlanComponentProps = {
  dailyPlan: DailyPlan;
};

const DailyPlanComponent: FC<DailyPlanComponentProps> = ({
  dailyPlan: { id: dailyPlanId, status, day, dayGoal, tasks },
}) => {
  const { finishDailyTaskList } = useDailyPlans("OPEN");
  const { toast } = useToast();
  const [changing, setChanging] = useState(false);

  const handleCheckedChange = async () => {
    setChanging(true);
    await finishDailyTaskList(dailyPlanId, toast);
    setChanging(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-start gap-3 sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent">
        {changing && (
          <Loader2 className="mt-[0.3rem] md:mt-[0.2rem] w-4 h-4 min-w-4 md:w-5 md:h-5 md:min-w-5 animate-spin text-muted-foreground" />
        )}
        {!changing && (
          <Checkbox
            checked={status === "DONE"}
            onCheckedChange={handleCheckedChange}
            className="mt-[0.3rem] md:mt-[0.4rem]"
          />
        )}
        <div className="text-xl md:text-2xl font-bold tracking-tight">
          {dayGoal} – {format(day, "PP")}
        </div>
      </div>
      {tasks.filter((t) => t.isInFocus && !t.done).length === 0 && (
        <p className="text-muted-foreground">No open taks</p>
      )}
      {flow(
        filter((task: DailyPlanTodo) => task.isInFocus),
        map(transformTaskType),
        map((task) => (
          <Task
            key={`${task.activityId}-${task.index}`}
            task={task}
            dailyPlanId={dailyPlanId}
          />
        ))
      )(tasks)}
    </div>
  );
};

export default DailyPlanComponent;
