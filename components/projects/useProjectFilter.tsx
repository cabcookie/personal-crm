import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { filterAndSortProjects } from "@/helpers/projects";
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

export const isValidProjectFilter = (
  filter: string
): filter is ProjectFilters =>
  PROJECT_FILTERS_CONST.includes(filter as ProjectFilters);

interface ProjectFilterType {
  projects: Project[];
  loadingProjects: ReturnType<typeof useProjectsContext>["loadingProjects"];
  errorProjects: ReturnType<typeof useProjectsContext>["errorProjects"];
  isSearchActive: boolean;
  projectFilter: ProjectFilters;
  setProjectFilter: (filter: string) => void;
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
  const { projects, loadingProjects, errorProjects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const { searchText, isSearchActive } = useSearch();
  const [filter, setFilter] = useState<ProjectFilters>("WIP");

  const onFilterChange = (newFilter: string) =>
    isValidProjectFilter(newFilter) && setFilter(newFilter);

  useEffect(() => {
    if (!projects) return setFilteredProjects([]);
    setFilteredProjects(
      filterAndSortProjects({
        projects,
        accountId,
        projectFilter: filter,
        accounts,
        searchText,
      })
    );
  }, [accountId, accounts, filter, projects, searchText]);

  return (
    <ProjectFilter.Provider
      value={{
        isSearchActive,
        setProjectFilter: onFilterChange,
        projectFilter: filter,
        projects: filteredProjects,
        loadingProjects,
        errorProjects,
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
        ;
      </SearchProvider>
    );
  };
}
