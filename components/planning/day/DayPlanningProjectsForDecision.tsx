import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { DailyPlan } from "@/api/useDailyPlans";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DayPlanningProjectsState from "./DayPlanningProjectsState";

type DayPlanningProjectsForDecisionProps = {
  dailyPlan: DailyPlan;
};

const DayPlanningProjectsForDecision: FC<
  DayPlanningProjectsForDecisionProps
> = ({ dailyPlan }) => {
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState<
    Project[]
  >([]);

  useEffect(() => {
    flow(
      filterAndSortProjectsForDailyPlanning(accounts, dailyPlan),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projects, dailyPlan]);

  return (
    <DayPlanningProjectsState
      projects={filteredAndSortedProjects}
      dayPlan={dailyPlan}
      onList={false}
      nextAction="Review each project and decide which projects you would like to
      focus on today. Remaining"
    />
  );
};

export default DayPlanningProjectsForDecision;
