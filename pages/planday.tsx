import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import DailyPlanForm from "@/components/planning/day/DailyPlanForm";
import DayPlanningProjectsState from "@/components/planning/day/DayPlanningProjectsState";
import NextAction from "@/components/planning/day/NextAction";
import { useContextContext } from "@/contexts/ContextContext";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { format } from "date-fns";
import { find, flow, identity } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const DailyPlanningPage = () => {
  const {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
  } = useDailyPlans("PLANNING");
  const { context } = useContextContext();
  const { projects } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [projectsOnList, setProjectsOnList] = useState<Project[] | undefined>();
  const [projectsForDecision, setProjectsForDecision] = useState<
    Project[] | undefined
  >();
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | undefined>();
  const [day, setDay] = useState<Date>(new Date());

  useEffect(() => {
    flow(
      identity<DailyPlan[] | undefined>,
      find(["context", context]),
      setDailyPlan
    )(dailyPlans);
  }, [dailyPlans, context]);

  useEffect(() => {
    setDay(dailyPlan?.day ?? new Date());
  }, [dailyPlan]);

  useEffect(() => {
    if (!dailyPlan) return;
    filterAndSortProjectsForDailyPlanning(
      projects,
      accounts,
      dailyPlan,
      false,
      setProjectsForDecision
    );
    filterAndSortProjectsForDailyPlanning(
      projects,
      accounts,
      dailyPlan,
      true,
      setProjectsOnList
    );
  }, [projects, accounts, dailyPlan]);

  return (
    <MainLayout title="Daily Planning" sectionName="Daily Planning">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : (
          <DailyPlanForm
            createDailyPlan={createDailyPlan}
            confirmDailyPlanning={confirmDailyPlanning}
            dailyPlan={dailyPlan}
          />
        )}

        {!dailyPlan && (
          <>
            <div className="space-y-2">
              <ContextSwitcher />
            </div>
            <NextAction action="Set a date and a goal for your daily tasks list." />
          </>
        )}

        <DayPlanningProjectsState
          projects={projectsForDecision}
          dayPlan={dailyPlan}
          nextAction="Review each project and decide which projects you would like to focus on today. Remaining"
        />

        <DayPlanningProjectsState
          projects={projectsOnList}
          dayPlan={dailyPlan}
          onList
          nextAction={`Projects on your list for ${format(day, "PP")}`}
        />
      </div>
    </MainLayout>
  );
};

export default DailyPlanningPage;
