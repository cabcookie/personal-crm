import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import {
  filterAndSortProjectsForWeeklyPlanning,
  ProjectFilters,
  setProjectsFilterCount,
} from "@/helpers/planning";
import { flow } from "lodash/fp";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useWeekPlanContext } from "./useWeekPlanContext";

interface PlanningProjectFilterType {
  projects: Project[];
  projectFilter: ProjectFilters;
  setProjectFilter: (filt: ProjectFilters) => void;
  openProjectsCount: number;
  focusProjectsCount: number;
  onholdProjectsCount: number;
  saveProjectDates: (props: {
    projectId: string;
    dueDate?: Date;
    doneOn?: Date;
    onHoldTill?: Date | null;
  }) => Promise<string | undefined>;
}

const PlanningProjectFilter = createContext<PlanningProjectFilterType | null>(
  null
);

export const usePlanningProjectFilter = () => {
  const searchContext = useContext(PlanningProjectFilter);
  if (!searchContext)
    throw new Error(
      "usePlanningProjectFilter must be used within PlanningProjectFilterProvider"
    );
  return searchContext;
};

interface PlanningProjectFilterProviderProps {
  children: React.ReactNode;
}

export const PlanningProjectFilterProvider: FC<
  PlanningProjectFilterProviderProps
> = ({ children }) => {
  const { projects, saveProjectDates } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const { weekPlan, startDate } = useWeekPlanContext();
  const [projectFilter, setProjectFilter] = useState<ProjectFilters>("Open");
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState(
    filterAndSortProjectsForWeeklyPlanning(
      accounts,
      startDate,
      weekPlan,
      projectFilter
    )(projects)
  );
  const [openProjectsCount, setOpenProjectsCount] = useState(0);
  const [focusProjectsCount, setFocusProjectsCount] = useState(0);
  const [onholdProjectsCount, setOnholdProjectsCount] = useState(0);

  useEffect(() => {
    flow(
      filterAndSortProjectsForWeeklyPlanning(
        accounts,
        startDate,
        weekPlan,
        projectFilter
      ),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projectFilter, projects, startDate, weekPlan]);

  useEffect(() => {
    setProjectsFilterCount(
      projects,
      accounts,
      startDate,
      weekPlan,
      setOpenProjectsCount,
      setFocusProjectsCount,
      setOnholdProjectsCount
    );
  }, [accounts, projects, startDate, weekPlan]);

  return (
    <PlanningProjectFilter.Provider
      value={{
        projects: filteredAndSortedProjects,
        projectFilter,
        setProjectFilter,
        openProjectsCount,
        onholdProjectsCount,
        focusProjectsCount,
        saveProjectDates,
      }}
    >
      {children}
    </PlanningProjectFilter.Provider>
  );
};
