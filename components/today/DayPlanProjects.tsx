import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { cn } from "@/lib/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { FC } from "react";
import DailyPlanProjectComponent from "../planning/day/DailyPlanProject";

type DayPlanProjectsProps = {
  dayPlan: DailyPlan;
  dayPlanProjects: DailyPlanProject[] | undefined;
  className?: string;
};

const DayPlanProjects: FC<DayPlanProjectsProps> = ({
  dayPlan,
  dayPlanProjects,
  className,
}) => (
  <Accordion type="single" collapsible className={cn("space-y-4", className)}>
    {dayPlanProjects?.map((p) => (
      <DailyPlanProjectComponent
        key={p.recordId}
        dailyPlanProject={p}
        dayPlan={dayPlan}
      />
    ))}
  </Accordion>
);

export default DayPlanProjects;
