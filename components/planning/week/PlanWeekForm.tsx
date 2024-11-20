import DateSelector from "@/components/ui-elements/selectors/date-selector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Loader2, Play } from "lucide-react";
import { useWeekPlanContext } from "../useWeekPlanContext";

const PlanWeekForm = () => {
  const {
    weekPlan,
    startDate,
    setStartDate,
    isLoading,
    confirmProjectSelection,
    createWeekPlan,
  } = useWeekPlanContext();

  return (
    <div className="space-y-2">
      <Label htmlFor="week-start-date" className="font-semibold">
        Start date of the week
      </Label>
      <DateSelector
        disabled={!!weekPlan}
        elementId="week-start-date"
        date={startDate}
        setDate={setStartDate}
      />
      {isLoading ? (
        <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
      ) : weekPlan ? (
        <Button onClick={confirmProjectSelection}>
          <div className="flex flex-row gap-2 items-center">
            <CalendarCheck className="w-4 h-4" /> Confirm Project Selection
          </div>
        </Button>
      ) : (
        <Button onClick={() => createWeekPlan(startDate)}>
          <div className="flex flex-row gap-2 items-center">
            <Play className="w-4 h-4" /> Start Week Planning
          </div>
        </Button>
      )}
    </div>
  );
};

export default PlanWeekForm;
