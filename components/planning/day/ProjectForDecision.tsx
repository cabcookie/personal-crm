import { Project, useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { isOnDayplan, setProjectMaybe } from "@/helpers/planning";
import { addDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import DecisionButton from "../DecisionButton";

type ProjectForDecisionProps = {
  dayPlan: DailyPlan;
  project: Project;
};

const ProjectForDecision: FC<ProjectForDecisionProps> = ({
  project,
  dayPlan,
}) => {
  const { addProjectToDayPlan, removeProjectFromDayPlan } =
    useDailyPlans("PLANNING");
  const { saveProjectDates } = useProjectsContext();
  const [savingDecision, setSavingDecision] = useState(false);
  const [maybe, setMaybe] = useState<boolean | undefined>();

  useEffect(() => {
    setProjectMaybe(dayPlan, project, setMaybe);
  }, []);

  const pushProject = async () => {
    setSavingDecision(true);
    if (isOnDayplan(dayPlan, project)) {
      await removeProjectFromDayPlan(dayPlan.id, project.id);
    }
    await saveProjectDates({
      projectId: project.id,
      onHoldTill: addDays(dayPlan.day, 1),
    });
  };

  const addProject = (maybe: boolean) => async () => {
    setSavingDecision(true);
    addProjectToDayPlan(dayPlan.id, project.id, maybe);
  };

  return (
    <div className="space-y-2">
      <div className="sticky top-[8.75rem] md:top-[10.5rem] z-30 bg-bgTransparent">
        <ProjectAccordionItem allowPushToNextDay project={project} showNotes />
      </div>

      <div className="text-sm ml-1 md:ml-2 text-muted-foreground">
        Will you work on this?
      </div>
      <div className="flex flex-row gap-2">
        <DecisionButton
          label="Yes"
          selected={maybe === false}
          disabled={savingDecision}
          makeDecision={addProject(false)}
        />
        <DecisionButton
          label="No"
          selected={false}
          disabled={savingDecision}
          makeDecision={pushProject}
        />
        <DecisionButton
          label="Maybe"
          selected={maybe === true}
          disabled={savingDecision}
          makeDecision={addProject(true)}
        />
        {savingDecision && (
          <Loader2 className="mt-2 w-5 h-5 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

export default ProjectForDecision;
