import { Project } from "@/api/ContextProjects";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import ProjectTasksSummary from "@/components/projects/ProjectTasksSummary";
import { usePlanningProjectFilter } from "@/components/planning/usePlanningProjectFilter";
import { FC } from "react";
import DecisionSection from "../DecisionSection";

type MakeProjectDecisionProps = {
  project: Project;
  saveOnHoldDate: (onHoldTill: Date | null) => void;
};

const MakeProjectDecision: FC<MakeProjectDecisionProps> = ({
  project,
  saveOnHoldDate,
}) => {
  const { moveProjectUp, moveProjectDown } = usePlanningProjectFilter();

  return (
    <div className="space-y-2">
      <ProjectAccordionItem
        project={project}
        onMoveUp={moveProjectUp}
        onMoveDown={moveProjectDown}
      />

      <ProjectTasksSummary projectId={project.id} className="mx-1 md:mx-2" />

      <DecisionSection
        project={project}
        className="mx-1 md:mx-2 flex flex-col space-y-2"
        saveOnHoldDate={saveOnHoldDate}
      />
    </div>
  );
};

export default MakeProjectDecision;
