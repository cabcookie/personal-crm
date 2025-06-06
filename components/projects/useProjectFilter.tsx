import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filterProjects } from "@/helpers/projects";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { SearchProvider, useSearch } from "../search/useSearch";

export const PROJECT_FILTERS = ["WIP", "On Hold", "Done"];
const PROJECT_FILTERS_CONST = ["WIP", "On Hold", "Done"] as const;
export type ProjectFilters = (typeof PROJECT_FILTERS_CONST)[number];

const isValidProjectFilter = (filter: string): filter is ProjectFilters =>
  PROJECT_FILTERS_CONST.includes(filter as ProjectFilters);

/**
 * Calculate the order value for moving a project up within a filtered list
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
 * Calculate the order value for moving a project down within a filtered list
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

interface ProjectFilterType {
  projects: Project[];
  loadingProjects: ReturnType<typeof useProjectsContext>["loadingProjects"];
  errorProjects: ReturnType<typeof useProjectsContext>["errorProjects"];
  isSearchActive: boolean;
  projectFilter: ProjectFilters;
  setProjectFilter: (filter: string) => void;
  moveProjectUp: (projectId: string) => Promise<string | undefined>;
  moveProjectDown: (projectId: string) => Promise<string | undefined>;
}

const ProjectFilter = createContext<ProjectFilterType | null>(null);

export const useProjectFilter = () => {
  const searchContext = useContext(ProjectFilter);
  if (!searchContext)
    throw new Error(
      "useProjectFilter must be used within ProjectFilterProvider"
    );
  return searchContext;
};

interface ProjectFilterProviderProps {
  children: React.ReactNode;
  accountId?: string;
}

export const ProjectFilterProvider: FC<ProjectFilterProviderProps> = ({
  children,
  accountId,
}) => {
  const {
    projects,
    loadingProjects,
    errorProjects,
    moveProjectUp: globalMoveProjectUp,
    moveProjectDown: globalMoveProjectDown,
  } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const { searchText, isSearchActive } = useSearch();
  const [filter, setFilter] = useState<ProjectFilters>("WIP");

  const onFilterChange = (newFilter: string) =>
    isValidProjectFilter(newFilter) && setFilter(newFilter);

  useEffect(() => {
    if (!projects) return setFilteredProjects([]);
    setFilteredProjects(
      filterProjects({
        projects,
        accountId,
        projectFilter: filter,
        accounts,
        searchText,
      })
    );
  }, [accountId, accounts, filter, projects, searchText]);

  // Filtered move functions that calculate order based on filtered context
  const moveProjectUp = async (
    projectId: string
  ): Promise<string | undefined> => {
    const newOrder = calculateMoveUpOrder(projectId, filteredProjects);
    if (newOrder === undefined) return;
    return await globalMoveProjectUp(projectId, newOrder);
  };

  const moveProjectDown = async (
    projectId: string
  ): Promise<string | undefined> => {
    const newOrder = calculateMoveDownOrder(projectId, filteredProjects);
    if (newOrder === undefined) return;
    return await globalMoveProjectDown(projectId, newOrder);
  };

  return (
    <ProjectFilter.Provider
      value={{
        isSearchActive,
        setProjectFilter: onFilterChange,
        projectFilter: filter,
        projects: filteredProjects,
        loadingProjects,
        errorProjects,
        moveProjectUp,
        moveProjectDown,
      }}
    >
      {children}
    </ProjectFilter.Provider>
  );
};

export function withProjectFilter<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <SearchProvider>
        <ProjectFilterProvider>
          <Component {...componentProps} />
        </ProjectFilterProvider>
      </SearchProvider>
    );
  };
}
