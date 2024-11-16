import useDailyPlans from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import DailyPlanForm from "@/components/planning/day/DailyPlanForm";
import DayPlanningProjectsForDecision from "@/components/planning/day/DayPlanningProjectsForDecision";
import DayPlanningProjectsOnList from "@/components/planning/day/DayPlanningProjectsOnList";
import NextAction from "@/components/planning/day/NextAction";
import { useContextContext } from "@/contexts/ContextContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const DailyPlanningPage = () => {
  const {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    addProjectToDayPlan,
  } = useDailyPlans("PLANNING");
  const { context } = useContextContext();
  const [dailyPlan, setDailyPlan] = useState(
    !dailyPlans ? undefined : dailyPlans.find((p) => p.context === context)
  );
  const [day, setDay] = useState(dailyPlan?.day || new Date());

  useEffect(() => {
    const newDaily = !dailyPlans
      ? undefined
      : dailyPlans.find((p) => p.context === context);
    setDailyPlan(newDaily);
    setDay(newDaily?.day || new Date());
  }, [dailyPlans, context]);

  return (
    <MainLayout title="Daily Planning" sectionName="Daily Planning">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : (
          <DailyPlanForm
            createDailyPlan={createDailyPlan}
            confirmDailyPlanning={confirmDailyPlanning}
            dailyPlan={dailyPlan}
          />
        )}

        {!dailyPlan && (
          <>
            <div className="space-y-2">
              <ContextSwitcher />
            </div>
            <NextAction action="Set a date and a goal for your daily tasks list." />
          </>
        )}

        {!!dailyPlan && (
          <>
            <DayPlanningProjectsOnList dayPlan={dailyPlan} />
            <NextAction
              action="Review each project and decide which projects you would like to
              focus on today."
            />
            <DayPlanningProjectsForDecision
              addProjectToDayPlan={(projectId) =>
                addProjectToDayPlan(dailyPlan.id, projectId)
              }
              day={day}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyPlanningPage;
