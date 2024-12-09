import { finishDayplan } from "@/api/dayplan/finish-dayplan";
import { DailyPlan, DailyPlanStatus } from "@/api/useDailyPlans";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FC } from "react";
import { Checkbox } from "../ui/checkbox";

type DayPlanInformationProps = {
  dayPlan: DailyPlan;
  className?: string;
  mutate: (status: DailyPlanStatus, refresh: boolean) => void;
};

const DayPlanInformation: FC<DayPlanInformationProps> = ({
  className,
  dayPlan,
  mutate,
}) => {
  const onFinish = () =>
    finishDayplan({
      data: { dayPlanId: dayPlan.id, done: dayPlan.status === "OPEN" },
      options: {
        mutate: (refresh) =>
          mutate(dayPlan.status === "OPEN" ? "DONE" : "OPEN", refresh),
      },
    });

  return (
    <div className={cn("flex flex-row items-start gap-3", className)}>
      <Checkbox
        checked={dayPlan.status === "DONE"}
        onCheckedChange={onFinish}
        className="mt-[0.3rem] md:mt-[0.4rem]"
      />
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">
        {dayPlan.dayGoal} – {format(dayPlan.day, "eeee, MMM d")}
      </h2>
    </div>
  );
};

export default DayPlanInformation;
