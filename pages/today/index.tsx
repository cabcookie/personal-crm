import useDailyPlans from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import DailyPlanComponent from "@/components/planning/DailyPlan";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const TodayPage = () => {
  const { dailyPlans, error, isLoading } = useDailyPlans("OPEN");
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
          dailyPlans?.map((dailyPlan) => (
            <DailyPlanComponent dailyPlan={dailyPlan} key={dailyPlan.id} />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
