import { useAccountsContext } from "@/api/ContextAccounts";
import {
  AccountProjects,
  mapAccountOrder,
  mapAccountProjects,
} from "@/helpers/planning";
import { filter, flow, map, sortBy } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePlanningProjectFilter } from "./usePlanningProjectFilter";

interface PlanAccountProjectsType {
  accountsProjects: AccountProjects[];
  loadingAccounts: boolean;
  errorAccounts: any;
  saveProjectDates: (props: {
    projectId: string;
    dueDate?: Date;
    doneOn?: Date;
    onHoldTill?: Date | null;
  }) => Promise<string | undefined>;
}

const PlanAccountProjects = createContext<PlanAccountProjectsType | null>(null);

export const usePlanAccountProjects = () => {
  const searchContext = useContext(PlanAccountProjects);
  if (!searchContext)
    throw new Error(
      "usePlanAccountProjects must be used within PlanAccountProjectsProvider"
    );
  return searchContext;
};

interface PlanAccountProjectsProviderProps {
  children: React.ReactNode;
}

export const PlanAccountProjectsProvider: FC<
  PlanAccountProjectsProviderProps
> = ({ children }) => {
  const { accounts, loadingAccounts, errorAccounts } = useAccountsContext();
  const { projects, saveProjectDates } = usePlanningProjectFilter();
  const [accountsProjects, setAccountsProjects] = useState<AccountProjects[]>(
    []
  );

  useEffect(() => {
    flow(
      map(mapAccountProjects(projects)),
      filter(({ projects }) => projects.length > 0),
      map(mapAccountOrder),
      sortBy((a) => -a.order),
      setAccountsProjects
    )(accounts);
  }, [accounts, projects]);

  return (
    <PlanAccountProjects.Provider
      value={{
        accountsProjects,
        loadingAccounts,
        errorAccounts,
        saveProjectDates,
      }}
    >
      {children}
    </PlanAccountProjects.Provider>
  );
};

export function withPlanAccountProjects<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <PlanAccountProjectsProvider>
        <Component {...componentProps} />
      </PlanAccountProjectsProvider>
    );
  };
}
