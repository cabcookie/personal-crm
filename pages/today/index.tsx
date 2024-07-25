import useDailyPlans from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import DailyPlanComponent from "@/components/planning/DailyPlan";
import { useContextContext } from "@/contexts/ContextContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const TodayPage = () => {
  const { dailyPlans, error, isLoading } = useDailyPlans("OPEN");
  const { context } = useContextContext();
  const [showCreateDayPlan, setShowCreateDayPlan] = useState(false);
  const [plan, setPlan] = useState(
    dailyPlans?.filter((p) => p.context === context)
  );

  useEffect(() => {
    setPlan(dailyPlans?.filter((p) => p.context === context));
  }, [context, dailyPlans]);

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
        ) : !plan || plan.length === 0 ? (
          <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
            No open task list.
          </div>
        ) : (
          plan.map((dailyPlan) => (
            <DailyPlanComponent dailyPlan={dailyPlan} key={dailyPlan.id} />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
