import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser, { User } from "@/api/useUser";
import { filter, flow } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { hasHygieneIssues } from "./pipeline-hygiene";

interface CrmProjectsFilterType {
  crmProjects: CrmProject[] | null;
  error: any;
  isLoading: boolean;
  selectedFilter: TProjectFilters;
  availableFilters: (TProjectFilters | "More" | "Back")[];
  onSelectFilter: (selectedFilter: string) => void;
}

const CrmProjectsFilter = createContext<CrmProjectsFilterType | null>(null);

export const useCrmProjectsFilter = () => {
  const filterContext = useContext(CrmProjectsFilter);
  if (!filterContext)
    throw new Error(
      "useCrmProjectsFilter must be used within CrmProjectsFilterProvider"
    );
  return filterContext;
};

interface CrmProjectsFilterProviderProps {
  children: ReactNode;
}

const PROJECT_FILTERS = ["All", "Hygiene", "By Partner", "By Account"] as const;

export type TProjectFilters = (typeof PROJECT_FILTERS)[number];

const isValidProjectFilter = (
  crmFilter: string
): crmFilter is TProjectFilters =>
  PROJECT_FILTERS.includes(crmFilter as TProjectFilters);

const hasPartnerLinked = (crm: CrmProject): boolean => !!crm.partnerName;

const hasAccountLinked = (crm: CrmProject): boolean => !!crm.accountName;

const enableUpdateDueFilter = (
  user: User | undefined,
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  crmProjects?.some(hasHygieneIssues(user)) ? ["Hygiene"] : [];

const CrmProjectsFilterProvider: FC<CrmProjectsFilterProviderProps> = ({
  children,
}) => {
  const { user } = useCurrentUser();
  const { crmProjects, isLoading, error } = useCrmProjects();
  const [availableFilters, setAvailableFilters] = useState<TProjectFilters[]>([
    "All",
  ]);
  const [selectedMore, setSelectedMore] = useState(false);
  const [filtered, setFiltered] = useState<CrmProject[] | null>(null);
  const [crmFilter, setCrmFilter] = useState<TProjectFilters>("All");

  useEffect(() => {
    if (!crmProjects) return setFiltered(null);
    if (crmFilter === "All") return setFiltered(crmProjects);
    if (crmFilter === "Hygiene")
      return flow(filter(hasHygieneIssues(user)), setFiltered)(crmProjects);
    if (crmFilter === "By Partner")
      return flow(filter(hasPartnerLinked), setFiltered)(crmProjects);
    if (crmFilter === "By Account")
      return flow(filter(hasAccountLinked), setFiltered)(crmProjects);
  }, [crmProjects, crmFilter, user]);

  useEffect(() => {
    if (!crmProjects) setAvailableFilters(["All"]);
    else
      setAvailableFilters(
        (
          [
            "All",
            ...enableUpdateDueFilter(user, crmProjects),
            "By Partner",
            "By Account",
          ] as TProjectFilters[]
        ).filter((t) => !!t)
      );
  }, [crmProjects, user]);

  const onFilterChange = (newFilter: string) =>
    newFilter === "More"
      ? setSelectedMore(true)
      : newFilter === "Back"
      ? setSelectedMore(false)
      : isValidProjectFilter(newFilter) && setCrmFilter(newFilter);

  return (
    <CrmProjectsFilter.Provider
      value={{
        crmProjects: filtered,
        isLoading,
        error,
        availableFilters:
          availableFilters.length > 3
            ? !selectedMore
              ? [...availableFilters.slice(0, 2), "More"]
              : [...availableFilters.slice(2, 4), "Back"]
            : availableFilters,
        onSelectFilter: onFilterChange,
        selectedFilter: crmFilter,
      }}
    >
      {children}
    </CrmProjectsFilter.Provider>
  );
};

export function withCrmProjectsFilter<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <CrmProjectsFilterProvider>
        <Component {...componentProps} />
      </CrmProjectsFilterProvider>
    );
  };
}
