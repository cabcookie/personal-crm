import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser, { User } from "@/api/useUser";
import { filter } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
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

type TProjectFilters = (typeof PROJECT_FILTERS)[number];

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
  const [selectedMore, setSelectedMore] = useState(false);
  const [crmFilter, setCrmFilter] = useState<TProjectFilters>("All");

  // Both values are derived from crmProjects and the active filter, so they
  // are computed during render instead of pushed into state from an effect.
  // PROJECT_FILTERS covers exactly these four cases.
  const filtered: CrmProject[] | null = useMemo(() => {
    if (!crmProjects) return null;
    if (crmFilter === "Hygiene")
      return filter(hasHygieneIssues(user), crmProjects);
    if (crmFilter === "By Partner")
      return filter(hasPartnerLinked, crmProjects);
    if (crmFilter === "By Account")
      return filter(hasAccountLinked, crmProjects);
    return crmProjects;
  }, [crmProjects, crmFilter, user]);

  const availableFilters: TProjectFilters[] = useMemo(() => {
    if (!crmProjects) return ["All"];
    return (
      [
        "All",
        ...enableUpdateDueFilter(user, crmProjects),
        "By Partner",
        "By Account",
      ] as TProjectFilters[]
    ).filter((t) => !!t);
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
