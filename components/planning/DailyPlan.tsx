import useDailyPlans, { DailyPlan, DailyPlanTodo } from "@/api/useDailyPlans";
import { format } from "date-fns";
import { flow, map, size, sortBy } from "lodash/fp";
import { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import TodoForDecision from "./TodoForDecision";
import TodoProjectInfos from "./TodoProjectInfos";

type DailyPlanComponentProps = {
  dailyPlan: DailyPlan;
};

const DailyPlanComponent: FC<DailyPlanComponentProps> = ({
  dailyPlan: { id: dailyPlanId, status, day, dayGoal, todos },
}) => {
  const { updateTodoStatus, finishDailyTaskList } = useDailyPlans("OPEN");

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-start gap-3 sticky top-[7rem] md:top-[8rem] z-30 bg-bgTransparent">
        <Checkbox
          checked={status === "DONE"}
          onCheckedChange={() => finishDailyTaskList(dailyPlanId)}
          className="mt-[0.3rem] md:mt-[0.4rem]"
        />
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {dayGoal} – {format(day, "PPP")}
        </h2>
      </div>

      {size(todos) === 0 ? (
        <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
          No open todos.
        </div>
      ) : (
        <div className="ml-7">
          {flow(
            sortBy((t: DailyPlanTodo) => (t.done ? 1 : 0)),
            map(
              ({ todo: { content }, todoId, activityId, done, projectIds }) => (
                <TodoForDecision
                  key={todoId}
                  activityId={activityId}
                  content={content}
                  todoStatus={done}
                  finishTodoOnDailyPlan={() => updateTodoStatus(todoId, !done)}
                >
                  <TodoProjectInfos projectIds={projectIds} />
                </TodoForDecision>
              )
            )
          )(todos)}
        </div>
      )}
    </div>
  );
};

export default DailyPlanComponent;
