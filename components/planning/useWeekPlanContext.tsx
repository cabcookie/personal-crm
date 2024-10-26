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

interface WeekPlanType {
  weekPlan: WeeklyPlan | undefined;
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
  } = useWeekPlan();
  const [startDate, setStartDate] = useState(
    weekPlan?.startDate || addDays(new Date(), 1)
  );

  useEffect(() => {
    if (!weekPlan) return;
    setStartDate(weekPlan.startDate);
  }, [weekPlan]);

  return (
    <WeekPlan.Provider
      value={{
        weekPlan,
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
