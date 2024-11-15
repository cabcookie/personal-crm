import { Project } from "@/api/ContextProjects";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
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
  return (
    <div className="space-y-2">
      <ProjectAccordionItem project={project} />

      <DecisionSection
        project={project}
        className="flex flex-col space-y-2"
        saveOnHoldDate={saveOnHoldDate}
      />
    </div>
  );
};

export default MakeProjectDecision;
