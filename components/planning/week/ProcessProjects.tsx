import useWeekPlan from "@/api/useWeekPlan";
import { PlanningProjectFilterProvider } from "@/components/planning/usePlanningProjectFilter";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import PlanWeekProjects from "@/components/planning/week/PlanWeekProjects";
import PlanWeekFilter from "@/components/planning/week/PlanWeekFilter";
import PlanWeekStatistics from "@/components/planning/week/PlanWeekStatistics";

const ProcessProjects = () => {
  const { weekPlan } = useWeekPlan();

  return (
    weekPlan && (
      <>
        <PlanWeekAction label="Review Projects" />
        <PlanningProjectFilterProvider>
          <PlanWeekStatistics />
          <PlanWeekFilter />
          <PlanWeekProjects />
        </PlanningProjectFilterProvider>
      </>
    )
  );
};

export default ProcessProjects;
