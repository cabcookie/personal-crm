import { Project, useProjectsContext } from "@/api/ContextProjects";
import ActivityFormatBadge from "@/components/activities/activity-format-badge";
import LeanActivitiy from "@/components/activities/activity-lean";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";

type ProjectActivitiesProps = {
  project?: Project;
  isVisible?: boolean;
};

const ProjectActivities: FC<ProjectActivitiesProps> = ({
  project,
  isVisible,
}) => {
  const { createProjectActivity } = useProjectsContext();
  return !project ? (
    "Loading…"
  ) : (
    <DefaultAccordionItem
      value="activities"
      triggerTitle="Project Notes"
      badge={project.hasOldVersionedActivityFormat && <ActivityFormatBadge />}
      isVisible={isVisible}
    >
      <div className="space-y-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={() => createProjectActivity(project.id)}
        >
          <PlusCircle className="w-4 h-4" />
          Activity
        </Button>

        <div className="space-y-10 pt-4">
          {project.activities.map((a) => (
            <LeanActivitiy key={a.id} activity={a} readonly />
          ))}
        </div>
      </div>
    </DefaultAccordionItem>
  );
};

export default ProjectActivities;
