import { PlanningProjectFilterProvider } from "@/components/planning/usePlanningProjectFilter";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import PlanWeekContextNotWork from "@/components/planning/week/PlanWeekContextNotWork";
import PlanWeekContextWork from "@/components/planning/week/PlanWeekContextWork";
import PlanWeekFilter from "@/components/planning/week/PlanWeekFilter";
import PlanWeekStatistics from "@/components/planning/week/PlanWeekStatistics";
import { useContextContext } from "@/contexts/ContextContext";
import { FC } from "react";

interface ProcessProjectsProps {}

const ProcessProjects: FC<ProcessProjectsProps> = (props) => {
  const { context } = useContextContext();
  return (
    <>
      <PlanWeekAction label="Review Projects" />
      <PlanningProjectFilterProvider>
        <PlanWeekStatistics />

        <PlanWeekFilter />

        {context !== "work" && <PlanWeekContextNotWork />}
        {context === "work" && <PlanWeekContextWork />}
      </PlanningProjectFilterProvider>
    </>
  );
};

export default ProcessProjects;
