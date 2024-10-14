import MakeProjectDecision from "@/components/planning/MakeProjectDecision";
import { usePlanningProjectFilter } from "@/components/planning/usePlanningProjectFilter";
import { Accordion } from "@/components/ui/accordion";
import { useWeekPlanContext } from "./useWeekPlanContext";

const PlanWeekContextNotWork = () => {
  const { weekPlan } = useWeekPlanContext();
  const { projects, saveProjectDates } = usePlanningProjectFilter();

  return (
    weekPlan && (
      <Accordion type="single" collapsible>
        {projects.map((project) => (
          <MakeProjectDecision
            key={project.id}
            project={project}
            saveOnHoldDate={(onHoldTill) =>
              saveProjectDates({ projectId: project.id, onHoldTill })
            }
          />
        ))}
      </Accordion>
    )
  );
};

export default PlanWeekContextNotWork;
