import { Project, useProjectsContext } from "@/api/ContextProjects";
import {
  filterProjectsForWeeklyPlanning,
  ProjectFilters,
  setProjectsFilterCount,
} from "@/helpers/planning";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useWeekPlanContext } from "./useWeekPlanContext";

/**
 * Calculate the order value for moving a project up within a planning filtered list
 * @param projectId The ID of the project to move
 * @param filteredProjects The filtered list of projects
 * @returns The new order value or undefined if movement is not possible
 */
const calculateMoveUpOrder = (
  projectId: string,
  filteredProjects: Project[]
): number | undefined => {
  const currentIndex = filteredProjects.findIndex((p) => p.id === projectId);

  if (currentIndex <= 0) return undefined; // Already at the top or not found

  if (currentIndex === 1) {
    // Moving to first position
    return filteredProjects[0].order - 0.5;
  } else {
    // Moving between two projects - calculate midpoint
    const firstProject = filteredProjects[currentIndex - 2];
    const secondProject = filteredProjects[currentIndex - 1];
    return (firstProject.order + secondProject.order) / 2;
  }
};

/**
 * Calculate the order value for moving a project down within a planning filtered list
 * @param projectId The ID of the project to move
 * @param filteredProjects The filtered list of projects
 * @returns The new order value or undefined if movement is not possible
 */
const calculateMoveDownOrder = (
  projectId: string,
  filteredProjects: Project[]
): number | undefined => {
  const currentIndex = filteredProjects.findIndex((p) => p.id === projectId);

  if (currentIndex === -1 || currentIndex >= filteredProjects.length - 1) {
    return undefined; // Not found or already at the bottom
  }

  if (currentIndex === filteredProjects.length - 2) {
    // Moving to last position
    return filteredProjects[currentIndex + 1].order + 1;
  } else {
    // Moving between two projects - calculate midpoint
    const firstProject = filteredProjects[currentIndex + 1];
    const secondProject = filteredProjects[currentIndex + 2];
    return (firstProject.order + secondProject.order) / 2;
  }
};

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
  moveProjectUp: (projectId: string) => Promise<string | undefined>;
  moveProjectDown: (projectId: string) => Promise<string | undefined>;
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
  const {
    projects,
    saveProjectDates,
    moveProjectUp: globalMoveProjectUp,
    moveProjectDown: globalMoveProjectDown,
  } = useProjectsContext();
  const { weekPlan, startDate } = useWeekPlanContext();
  const [projectFilter, setProjectFilter] = useState<ProjectFilters>("Open");
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState<
    Project[]
  >([]);
  const [openProjectsCount, setOpenProjectsCount] = useState(0);
  const [focusProjectsCount, setFocusProjectsCount] = useState(0);
  const [onholdProjectsCount, setOnholdProjectsCount] = useState(0);

  useEffect(() => {
    filterProjectsForWeeklyPlanning(
      projects,
      startDate,
      weekPlan,
      projectFilter,
      setFilteredAndSortedProjects
    );
  }, [projectFilter, projects, startDate, weekPlan]);

  useEffect(() => {
    setProjectsFilterCount(
      projects,
      startDate,
      weekPlan,
      setOpenProjectsCount,
      setFocusProjectsCount,
      setOnholdProjectsCount
    );
  }, [projects, startDate, weekPlan]);

  // Planning-specific filtered move functions that calculate order based on planning filtered context
  const moveProjectUp = async (
    projectId: string
  ): Promise<string | undefined> => {
    const newOrder = calculateMoveUpOrder(projectId, filteredAndSortedProjects);
    if (newOrder === undefined) return;

    return await globalMoveProjectUp(projectId, newOrder);
  };

  const moveProjectDown = async (
    projectId: string
  ): Promise<string | undefined> => {
    const newOrder = calculateMoveDownOrder(
      projectId,
      filteredAndSortedProjects
    );
    if (newOrder === undefined) return;
    return await globalMoveProjectDown(projectId, newOrder);
  };

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
        moveProjectUp,
        moveProjectDown,
      }}
    >
      {children}
    </PlanningProjectFilter.Provider>
  );
};
