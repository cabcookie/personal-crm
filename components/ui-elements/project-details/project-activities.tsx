import { Project, useProjectsContext } from "@/api/ContextProjects";
import ActivityComponent from "@/components/activities/activity";
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
      triggerTitle="Notes"
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
        {project.activityIds.map((id) => (
          <ActivityComponent key={id} activityId={id} showDates showMeeting />
        ))}
      </div>
    </DefaultAccordionItem>
  );
};

export default ProjectActivities;
