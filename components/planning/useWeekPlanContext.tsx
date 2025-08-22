import { handleApiErrors } from "@/api/globals";
import useWeekPlan, { WeeklyPlan } from "@/api/useWeekPlan";
import { addDays } from "date-fns";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "../ui/use-toast";
import { client } from "@/lib/amplify";

interface WeekPlanType {
  weekPlan: WeeklyPlan | undefined;
  inboxSkipped: boolean;
  financialUpdateSkipped: boolean;
  crmUpdateSkipped: boolean;
  skipInbox?: () => void;
  skipFinancialUpdate?: () => void;
  skipCrmUpdate?: () => void;
  createWeekPlan: (startDate: Date) => Promise<void>;
  confirmProjectSelection: () => Promise<string | undefined>;
  startDate: Date;
  setStartDate: (date: Date) => void;
  isLoading: boolean;
  error: any;
}

const WeekPlan = createContext<WeekPlanType | null>(null);

export const useWeekPlanContext = () => {
  const searchContext = useContext(WeekPlan);
  if (!searchContext)
    throw new Error("useWeekPlan must be used within WeekPlanProvider");
  return searchContext;
};

interface WeekPlanProviderProps {
  children: React.ReactNode;
}

const WeekPlanProvider: FC<WeekPlanProviderProps> = ({ children }) => {
  const {
    weekPlan,
    createWeekPlan,
    isLoading,
    error,
    confirmProjectSelection,
    mutate,
  } = useWeekPlan();
  const [startDate, setStartDate] = useState(
    weekPlan?.startDate || addDays(new Date(), 1)
  );

  useEffect(() => {
    if (!weekPlan) return;
    setStartDate(weekPlan.startDate);
  }, [weekPlan]);

  const skipInbox = !weekPlan
    ? undefined
    : async () => {
        console.log("skipInbox");
        if (!weekPlan) return;
        const { data, errors } = await client.models.WeeklyPlan.update({
          id: weekPlan.id,
          inboxSkipped: true,
        });
        if (errors) handleApiErrors(errors, "Couldn't skip inbox");
        mutate({ ...weekPlan, inboxSkipped: true }, true);
        if (!data) return;
        toast({ title: "Skipped inbox" });
      };

  const skipFinancialUpdate = !weekPlan
    ? undefined
    : async () => {
        if (!weekPlan) return;
        const { data, errors } = await client.models.WeeklyPlan.update({
          id: weekPlan.id,
          financialUpdateSkipped: true,
        });
        if (errors) handleApiErrors(errors, "Couldn't skip financial update");
        mutate({ ...weekPlan, financialUpdateSkipped: true }, true);
        if (!data) return;
        toast({ title: "Skipped financial update" });
      };

  const skipCrmUpdate = !weekPlan
    ? undefined
    : async () => {
        if (!weekPlan) return;
        const { data, errors } = await client.models.WeeklyPlan.update({
          id: weekPlan.id,
          crmUpdateSkipped: true,
        });
        if (errors) handleApiErrors(errors, "Couldn't skip CRM update");
        mutate({ ...weekPlan, crmUpdateSkipped: true }, true);
        if (!data) return;
        toast({ title: "Skipped CRM update" });
      };

  return (
    <WeekPlan.Provider
      value={{
        weekPlan,
        inboxSkipped: !!weekPlan?.inboxSkipped,
        financialUpdateSkipped: !!weekPlan?.financialUpdateSkipped,
        crmUpdateSkipped: !!weekPlan?.crmUpdateSkipped,
        skipInbox,
        skipFinancialUpdate,
        skipCrmUpdate,
        createWeekPlan,
        confirmProjectSelection,
        startDate,
        setStartDate,
        isLoading,
        error,
      }}
    >
      {children}
    </WeekPlan.Provider>
  );
};

export function withWeekPlan<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <WeekPlanProvider>
        <Component {...componentProps} />
      </WeekPlanProvider>
    );
  };
}
