import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import DailyPlanComponent from "@/components/planning/DailyPlan";
import { Context, useContextContext } from "@/contexts/ContextContext";
import { filter, flow, map, size } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const getDailyPlansByContext = (context: Context) =>
  filter((plan: DailyPlan) => plan.context === context);

const TodayPage = () => {
  const { dailyPlans, error, isLoading } = useDailyPlans("OPEN");
  const [contextDailyPlans, setContextDailyPlans] = useState<
    DailyPlan[] | undefined
  >();
  const { context } = useContextContext();

  useEffect(() => {
    if (!context) return;
    flow(getDailyPlansByContext(context), setContextDailyPlans)(dailyPlans);
  }, [context, dailyPlans]);

  return (
    <MainLayout title="Today's Tasks" sectionName="Today's Tasks">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : size(contextDailyPlans) === 0 ? (
          <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
            No open todo list.
          </div>
        ) : (
          flow(
            map((plan: DailyPlan) => (
              <DailyPlanComponent key={plan.id} dailyPlan={plan} />
            ))
          )(contextDailyPlans)
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
