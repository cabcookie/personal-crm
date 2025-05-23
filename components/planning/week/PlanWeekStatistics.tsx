import { usePlanningProjectFilter } from "../usePlanningProjectFilter";
import { useWeekPlanContext } from "../useWeekPlanContext";

const PlanWeekStatistics = () => {
  const { weekPlan } = useWeekPlanContext();
  const { openProjectsCount, onholdProjectsCount, focusProjectsCount } =
    usePlanningProjectFilter();

  return (
    <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
      {weekPlan && (
        <div>
          <div>Projects to be reviewed: {openProjectsCount}</div>
          <div>Projects on hold: {onholdProjectsCount}</div>
          <div>Projects in focus: {focusProjectsCount}</div>
        </div>
      )}
    </div>
  );
};

export default PlanWeekStatistics;
