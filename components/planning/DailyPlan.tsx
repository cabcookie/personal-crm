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
    <div className="items-start flex space-x-2 tracking-tight">
      {changing && (
        <Loader2 className="w-4 h-4 md:w-5 md:h-5 md:mt-1 sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent animate-spin text-muted-foreground" />
      )}

      {!changing && (
        <Checkbox
          id={dailyPlanId}
          checked={status === "DONE"}
          onCheckedChange={handleCheckedChange}
          className="mt-[0.1rem] md:mt-[0.3rem] sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent"
        />
      )}

      <div className="grid gap-2 leading-none w-full">
        <label
          htmlFor={dailyPlanId}
          className="text-lg md:text-xl font-bold  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent pb-2 flex gap-2"
        >
          {dayGoal} – {format(day, "PPP")}
        </label>

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
    </div>
  );
};

export default DailyPlanComponent;
