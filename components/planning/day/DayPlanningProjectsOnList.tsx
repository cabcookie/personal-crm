import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { DailyPlan } from "@/api/useDailyPlans";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { format } from "date-fns";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DayPlanningProjectsState from "./DayPlanningProjectsState";

type DayPlanningProjectsOnListProps = {
  dayPlan: DailyPlan;
};

const DayPlanningProjectsOnList: FC<DayPlanningProjectsOnListProps> = ({
  dayPlan,
}) => {
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState<
    Project[]
  >([]);

  useEffect(() => {
    flow(
      filterAndSortProjectsForDailyPlanning(accounts, dayPlan, true),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projects, dayPlan]);

  return (
    <DayPlanningProjectsState
      projects={filteredAndSortedProjects}
      dayPlan={dayPlan}
      onList={true}
      nextAction={`Projects on your list for ${format(dayPlan.day, "PP")}`}
    />
  );
};

export default DayPlanningProjectsOnList;
