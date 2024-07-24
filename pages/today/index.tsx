import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import Task from "@/components/planning/Task";
import { Checkbox } from "@/components/ui/checkbox";
import { transformTaskType } from "@/helpers/planning";
import { format } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const TodayPage = () => {
  const { dailyPlans, error, isLoading } = useDailyPlans();
  const [showCreateDayPlan, setShowCreateDayPlan] = useState(false);

  return (
    <MainLayout
      title="Today's Tasks"
      sectionName="Today's Tasks"
      addButton={
        showCreateDayPlan
          ? undefined
          : {
              label: "New",
              onClick: () => setShowCreateDayPlan(true),
            }
      }
    >
      <div className="space-y-12">
        <ApiLoadingError error={error} title="Loading Daily Task List Failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : (
          dailyPlans?.map(
            ({ id: dailyPlanId, day, dayGoal, status, tasks }) => (
              <div
                key={dailyPlanId}
                className="items-start flex space-x-2 tracking-tight"
              >
                <Checkbox
                  id={dailyPlanId}
                  checked={status === "DONE"}
                  onCheckedChange={() => {}}
                  className="mt-[0.1rem] md:mt-[0.3rem] sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent "
                />
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
                      />
                    ))
                  )(tasks)}
                </div>
              </div>
            )
          )
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
