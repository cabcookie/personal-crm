import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import {
  AccountProjects,
  addEmptyAccount,
  mapAccountOrder,
  mapAccountProjects,
} from "@/helpers/planning";
import { filter, flow, identity, map, sortBy } from "lodash/fp";
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

const PlanAccountProjectsProvider: FC<PlanAccountProjectsProviderProps> = ({
  children,
}) => {
  const { accounts, loadingAccounts, errorAccounts } = useAccountsContext();
  const { projects, saveProjectDates } = usePlanningProjectFilter();
  const { projects: allProjects } = useProjectsContext();
  const [accountsProjects, setAccountsProjects] = useState<AccountProjects[]>(
    []
  );

  useEffect(() => {
    flow(
      identity<Account[] | undefined>,
      addEmptyAccount,
      map(mapAccountProjects(projects)),
      filter(({ projects }) => projects.length > 0),
      map(mapAccountOrder(allProjects)),
      sortBy((a) => -a.order),
      setAccountsProjects
    )(accounts);
  }, [accounts, projects, allProjects]);

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
