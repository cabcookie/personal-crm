import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import DailyPlanForm from "@/components/planning/DailyPlanForm";
import ReviewProjectForDailyPlanning from "@/components/planning/ReviewProjectForDailyPlanning";
import TodoForDecision from "@/components/planning/TodoForDecision";
import TodoProjectInfos from "@/components/planning/TodoProjectInfos";
import { Accordion } from "@/components/ui/accordion";
import { useContextContext } from "@/contexts/ContextContext";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { flow } from "lodash/fp";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const DailyPlanningPage = () => {
  const {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    addTodoToDailyPlan,
    removeTodoFromDailyPlan,
  } = useDailyPlans("PLANNING");
  const { context } = useContextContext();
  const [dailyPlan, setDailyPlan] = useState(
    !dailyPlans ? undefined : dailyPlans.find((p) => p.context === context)
  );
  const [day, setDay] = useState(dailyPlan?.day || new Date());
  const { projects, saveProjectDates } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState(
    filterAndSortProjectsForDailyPlanning(accounts, day)(projects)
  );

  useEffect(() => {
    const newDaily = !dailyPlans
      ? undefined
      : dailyPlans.find((p) => p.context === context);
    setDailyPlan(newDaily);
    setDay(newDaily?.day || new Date());
  }, [dailyPlans, context]);

  useEffect(() => {
    flow(
      filterAndSortProjectsForDailyPlanning(accounts, day),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projects, day]);

  return (
    <MainLayout title="Daily Planning" sectionName="Daily Planning">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : (
          dailyPlan && (
            <DailyPlanForm
              createDailyPlan={createDailyPlan}
              confirmDailyPlanning={confirmDailyPlanning}
              dailyPlan={dailyPlan}
            />
          )
        )}

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        {dailyPlan?.todos && dailyPlan.todos.length > 0 && (
          <div className="space-y-2">
            <h3 className="flex-1 text-xl md:text-2xl font-bold leading-6 tracking-tight uppercase">
              Todos on the list
            </h3>
            {dailyPlan.todos.map((t) => (
              <TodoForDecision
                key={t.recordId}
                content={t.todo.content}
                removeTodoFromDailyPlan={() =>
                  removeTodoFromDailyPlan(t.recordId)
                }
                activityId={t.activityId}
              >
                <TodoProjectInfos projectIds={t.projectIds} />
              </TodoForDecision>
            ))}
          </div>
        )}

        <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
          {!dailyPlan ? (
            "Set a date and a goal for your daily tasks list."
          ) : (
            <div>
              <div>
                Review each project and its tasks and decide which tasks you
                would like to focus on today.
              </div>
            </div>
          )}
        </div>

        {dailyPlan && (
          <Accordion type="single" collapsible>
            <div className="space-y-12">
              {filteredAndSortedProjects.map((project) => (
                <ReviewProjectForDailyPlanning
                  key={project.id}
                  dailyPlan={dailyPlan}
                  project={project}
                  updateOnHoldDate={(onHoldTill) =>
                    saveProjectDates({ projectId: project.id, onHoldTill })
                  }
                  putTodoOnDailyPlan={(todo: DailyPlanTodo) =>
                    addTodoToDailyPlan(dailyPlan.id, todo)
                  }
                />
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyPlanningPage;
