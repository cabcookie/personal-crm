import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import PlanWeekContextNotWork from "@/components/planning/PlanWeekContextNotWork";
import PlanWeekContextWork from "@/components/planning/PlanWeekContextWork";
import PlanWeekFilter from "@/components/planning/PlanWeekFilter";
import PlanWeekForm from "@/components/planning/PlanWeekForm";
import PlanWeekStatistics from "@/components/planning/PlanWeekStatistics";
import { PlanningProjectFilterProvider } from "@/components/planning/usePlanningProjectFilter";
import {
  useWeekPlanContext,
  withWeekPlan,
} from "@/components/planning/useWeekPlanContext";
import { useContextContext } from "@/contexts/ContextContext";

const WeeklyPlanningPage = () => {
  const { context } = useContextContext();
  const { error } = useWeekPlanContext();

  return (
    <MainLayout title="Weekly Planning" sectionName="Weekly Planning">
      <ApiLoadingError error={error} title="Loading Week Plan Failed" />

      <div className="space-y-6">
        <PlanWeekForm />

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        <PlanningProjectFilterProvider>
          <PlanWeekStatistics />

          <PlanWeekFilter />

          {context !== "work" && <PlanWeekContextNotWork />}
          {context === "work" && <PlanWeekContextWork />}
        </PlanningProjectFilterProvider>
      </div>
    </MainLayout>
  );
};

export default withWeekPlan(WeeklyPlanningPage);
