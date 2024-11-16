import { DailyPlan } from "@/api/useDailyPlans";
import { FC } from "react";

type DayPlanningProjectsOnListProps = {
  dayPlan?: DailyPlan;
};

const DayPlanningProjectsOnList: FC<DayPlanningProjectsOnListProps> = ({
  dayPlan,
}) => {
  return <div>DayPlanningProjectsOnList</div>;
};

export default DayPlanningProjectsOnList;

/**
 * 
        {!!dailyPlan?.todos.length && (
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
 */
