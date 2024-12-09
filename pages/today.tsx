import useDailyPlans, {
  DailyPlan,
  DailyPlanProject,
  DailyPlanStatus,
} from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import DailyPlanComponent from "@/components/today/DailyPlan";
import { size } from "lodash/fp";
import { Loader2 } from "lucide-react";

interface DailyPlanTodo {
  todoId: string;
  postPoned?: boolean;
  done?: boolean;
}

const TodayPage = () => {
  const { dailyPlans, error, isLoading, mutate } = useDailyPlans("OPEN");

  const onDayPlanChange =
    (dayPlan: DailyPlan) => (status: DailyPlanStatus, refresh: boolean) =>
      mutate(
        dailyPlans?.map(
          (p) => (p.id !== dayPlan.id ? p : { ...p, status }),
          refresh
        )
      );

  const onProjectChange =
    (dayPlan: DailyPlan) => (updated: DailyPlanProject, refresh: boolean) =>
      mutate(
        dailyPlans?.map(
          (p) =>
            p.id !== dayPlan.id
              ? p
              : {
                  ...p,
                  projects: p.projects.map((pr) =>
                    pr.projectId !== updated.projectId ? pr : updated
                  ),
                },
          refresh
        )
      );

  const onTodoChange =
    (dayPlan: DailyPlan) => (updated: DailyPlanTodo, refresh: boolean) => {
      mutate(
        dailyPlans?.map((p) =>
          p.id !== dayPlan.id
            ? p
            : {
                ...p,
                todos: p.todos.map((t) =>
                  t.todoId !== updated.todoId ? t : { ...t, ...updated }
                ),
              }
        ),
        refresh
      );
    };

  return (
    <MainLayout title="Today's Tasks" sectionName="Today's Tasks">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Todos failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : size(dailyPlans) === 0 ? (
          <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
            No open todo list.
          </div>
        ) : (
          dailyPlans?.map((plan: DailyPlan) => (
            <DailyPlanComponent
              key={plan.id}
              dailyPlan={plan}
              mutateDayPlan={onDayPlanChange(plan)}
              mutateProject={onProjectChange(plan)}
              mutateTodo={onTodoChange(plan)}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default TodayPage;
