import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import DailyPlanComponent from "@/components/today/DailyPlan";
import { size } from "lodash/fp";
import { Loader2 } from "lucide-react";

const TodayPage = () => {
  const { dailyPlans, error, isLoading } = useDailyPlans("PLANNING");

  return (
    <MainLayout title="Today's Tasks" sectionName="Today's Tasks">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : size(dailyPlans) === 0 ? (
          <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
            No open todo list.
          </div>
        ) : (
          dailyPlans?.map((plan: DailyPlan) => (
            <DailyPlanComponent key={plan.id} dailyPlan={plan} />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
