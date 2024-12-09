import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { cn } from "@/lib/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { FC } from "react";
import DailyPlanProjectComponent from "../planning/day/DailyPlanProject";

interface DailyPlanTodo {
  todoId: string;
  postPoned?: boolean;
  done?: boolean;
}

interface DayPlanProjectsProps {
  dayPlan: DailyPlan;
  dayPlanProjects: DailyPlanProject[] | undefined;
  mutateTodo: (todo: DailyPlanTodo, refresh: boolean) => void;
  mutateProject: (project: DailyPlanProject, refresh: boolean) => void;
  className?: string;
}

const DayPlanProjects: FC<DayPlanProjectsProps> = ({
  dayPlan,
  dayPlanProjects,
  mutateTodo,
  mutateProject,
  className,
}) => (
  <Accordion type="single" collapsible className={cn("space-y-4", className)}>
    {dayPlanProjects?.map((p) => (
      <DailyPlanProjectComponent
        key={p.recordId}
        dailyPlanProject={p}
        dayPlan={dayPlan}
        mutateTodo={mutateTodo}
        mutateProject={mutateProject}
      />
    ))}
  </Accordion>
);

export default DayPlanProjects;
