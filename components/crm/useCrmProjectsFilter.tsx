import { TCrmStages } from "@/api/useCrmProject";
import useCrmProjects, { CrmProject } from "@/api/useCrmProjects";
import useCurrentUser, { User } from "@/api/useUser";
import { filter, flow, some } from "lodash/fp";
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

const PROJECT_FILTERS = [
  "All",
  "No Project",
  "Update Due",
  "Other Owner",
  "Differenct Account",
  "Differenct Partner",
  "By Partner",
  "By Account",
] as const;

export type TProjectFilters = (typeof PROJECT_FILTERS)[number];

const isValidProjectFilter = (
  crmFilter: string
): crmFilter is TProjectFilters =>
  PROJECT_FILTERS.includes(crmFilter as TProjectFilters);

const not =
  (fn: (crm: CrmProject) => boolean) =>
  (crm: CrmProject): boolean =>
    !fn(crm);

const hasNoProjectLinked = (crm: CrmProject): boolean =>
  isNotClosed(crm) && (!crm.projectIds || crm.projectIds.length === 0);

const hasPartnerLinked = (crm: CrmProject): boolean => !!crm.partnerName;

const hasAccountLinked = (crm: CrmProject): boolean => !!crm.accountName;

const isOtherOpportunityOwner =
  (currentUser: User | undefined) =>
  (crm: CrmProject): boolean =>
    crm.opportunityOwner !== currentUser?.userName;

const isDifferentAccountName = (crm: CrmProject): boolean =>
  isNotClosed(crm) &&
  not(hasNoProjectLinked)(crm) &&
  !!crm.accountName &&
  (!crm.projectAccountNames?.length ||
    !crm.projectAccountNames.includes(crm.accountName));

const isDifferentPartnerName = (crm: CrmProject): boolean =>
  isNotClosed(crm) &&
  not(hasNoProjectLinked)(crm) &&
  !!crm.partnerName &&
  (!crm.linkedPartnerNames?.length ||
    !crm.linkedPartnerNames.includes(crm.partnerName));

const isNotClosed = (crm: CrmProject): boolean =>
  !(["Closed Lost", "Launched"] as TCrmStages[]).includes(crm.stage);

const enableNoProjectFilter = (
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  some(hasNoProjectLinked)(crmProjects) ? ["No Project"] : [];

const enableOtherOwnerFilter = (
  currentUser: User | undefined,
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  !currentUser || !crmProjects?.some(isOtherOpportunityOwner(currentUser))
    ? []
    : ["Other Owner"];

const enableDifferentAccountFilter = (
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  crmProjects?.some(isDifferentAccountName) ? ["Differenct Account"] : [];

const enableDifferentPartnerFilter = (
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  crmProjects?.some(isDifferentPartnerName) ? ["Differenct Partner"] : [];

const enableUpdateDueFilter = (
  crmProjects: CrmProject[] | undefined
): TProjectFilters[] =>
  crmProjects?.some(hasHygieneIssues) ? ["Update Due"] : [];

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
    if (crmFilter === "Update Due")
      return flow(filter(hasHygieneIssues), setFiltered)(crmProjects);
    if (crmFilter === "No Project")
      return flow(filter(hasNoProjectLinked), setFiltered)(crmProjects);
    if (crmFilter === "Other Owner")
      return flow(
        filter(isOtherOpportunityOwner(user)),
        setFiltered
      )(crmProjects);
    if (crmFilter === "Differenct Account")
      return flow(filter(isDifferentAccountName), setFiltered)(crmProjects);
    if (crmFilter === "Differenct Partner")
      return flow(filter(isDifferentPartnerName), setFiltered)(crmProjects);
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
            ...enableNoProjectFilter(crmProjects),
            ...enableDifferentAccountFilter(crmProjects),
            ...enableDifferentPartnerFilter(crmProjects),
            ...enableUpdateDueFilter(crmProjects),
            "By Partner",
            "By Account",
            ...enableOtherOwnerFilter(user, crmProjects),
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
