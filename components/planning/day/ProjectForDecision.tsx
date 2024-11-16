import { Project } from "@/api/ContextProjects";
import ProjectAccordionItem from "@/components/projects/ProjectAccordionItem";
import { FC, useState } from "react";
import DecisionButton from "../DecisionButton";

type ProjectForDecisionProps = {
  project: Project;
  pushProjectToNextDay: () => void;
};

const ProjectForDecision: FC<ProjectForDecisionProps> = ({
  project,
  pushProjectToNextDay,
}) => {
  const [pushingProject, setPushingProject] = useState(false);

  const pushProject = () => {
    setPushingProject(true);
    pushProjectToNextDay();
  };

  return (
    <div className="space-y-2 mb-8">
      <div className="sticky top-[8.75rem] md:top-[10.5rem] z-30 bg-bgTransparent">
        <ProjectAccordionItem allowPushToNextDay project={project} showNotes />
      </div>

      <div className="text-sm ml-1 md:ml-2 text-muted-foreground">
        Will you work on this?
      </div>
      <div className="flex flex-row gap-2">
        <DecisionButton
          label="Yes"
          selected={false}
          isLoading={pushingProject}
          makeDecision={pushProject}
        />
        <DecisionButton
          label="No"
          selected={false}
          isLoading={pushingProject}
          makeDecision={pushProject}
        />
        <DecisionButton
          label="Maybe"
          selected={false}
          isLoading={pushingProject}
          makeDecision={pushProject}
        />
      </div>
    </div>
  );
};

export default ProjectForDecision;
