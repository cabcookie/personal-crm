import { useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Project } from "@/api/ContextProjects";
import { DailyPlan } from "@/api/useDailyPlans";
import { addDays } from "date-fns";
import { FC, useState } from "react";
import ProjectAccordionItem from "../projects/ProjectAccordionItem";
import { Accordion } from "../ui/accordion";
import { Separator } from "../ui/separator";
import DecisionButton from "./DecisionButton";
import MakeTaskDecision from "./MakeTaskDecision";

type ReviewProjectForDailyPlanningProps = {
  dailyPlan: DailyPlan;
  project: Project;
  updateOnHoldDate: (onHoldTill: Date | null) => void;
};

const ReviewProjectForDailyPlanning: FC<ReviewProjectForDailyPlanningProps> = ({
  dailyPlan,
  project,
  updateOnHoldDate,
}) => {
  const { openTasksByProjectId } = useOpenTasksContext();
  const [pushingProject, setPushingProject] = useState(false);

  const pushProject = () => {
    setPushingProject(true);
    updateOnHoldDate(addDays(dailyPlan.day, 1));
  };

  return (
    <div className="space-y-2 mb-8">
      <DecisionButton
        label="Push project to next day"
        selected={false}
        isLoading={pushingProject}
        makeDecision={pushProject}
      />

      <ProjectAccordionItem project={project} disabled={pushingProject} />

      <Accordion type="single" collapsible>
        {openTasksByProjectId(project.id).map((task) => (
          <MakeTaskDecision
            key={`${task.activityId}-${task.index}`}
            dailyPlan={dailyPlan}
            openTask={task}
          />
        ))}
      </Accordion>

      <div className="pt-4" />
      <Separator className="h-[1px] bg-blue-400" />
    </div>
  );
};

export default ReviewProjectForDailyPlanning;
