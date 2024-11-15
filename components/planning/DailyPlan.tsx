import { Project } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import { useTodosProjects } from "@/helpers/useTodosProjects";
import { format } from "date-fns";
import { map, size } from "lodash/fp";
import { FC } from "react";
import { Accordion } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import DailyPlanProject from "./DailyPlanProject";

type DailyPlanComponentProps = {
  dailyPlan: DailyPlan;
};

const DailyPlanComponent: FC<DailyPlanComponentProps> = ({
  dailyPlan: { id: dailyPlanId, status, day, dayGoal, todos },
}) => {
  const projects = useTodosProjects(todos);
  const { finishDailyTaskList } = useDailyPlans("OPEN");

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-start gap-3 sticky pt-1 top-[6.75rem] md:top-[8.25rem] z-[35] bg-bgTransparent">
        <Checkbox
          checked={status === "DONE"}
          onCheckedChange={() => finishDailyTaskList(dailyPlanId)}
          className="mt-[0.3rem] md:mt-[0.4rem]"
        />
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          {dayGoal} – {format(day, "eeee, MMM d")}
        </h2>
      </div>

      {size(todos) === 0 ? (
        <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
          No open todos.
        </div>
      ) : (
        <Accordion type="single" collapsible className="ml-7">
          {map((project: Project) => (
            <DailyPlanProject
              key={project.id}
              project={project}
              todos={todos}
            />
          ))(projects)}
        </Accordion>
      )}
    </div>
  );
};

export default DailyPlanComponent;
