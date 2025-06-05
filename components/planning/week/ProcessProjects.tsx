import useWeekPlan from "@/api/useWeekPlan";
import { PlanningProjectFilterProvider } from "@/components/planning/usePlanningProjectFilter";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import PlanWeekFilter from "@/components/planning/week/PlanWeekFilter";
import PlanWeekStatistics from "@/components/planning/week/PlanWeekStatistics";
import PlanWeekProjectList from "./PlanWeekProjectList";

const ProcessProjects = () => {
  const { weekPlan } = useWeekPlan();

  return (
    weekPlan && (
      <>
        <PlanWeekAction label="Review Projects" />
        <PlanningProjectFilterProvider>
          <PlanWeekStatistics />
          <PlanWeekFilter />
          <PlanWeekProjectList />
        </PlanningProjectFilterProvider>
      </>
    )
  );
};

export default ProcessProjects;
