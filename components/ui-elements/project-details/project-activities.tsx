import { Project, useProjectsContext } from "@/api/ContextProjects";
import ActivityComponent from "@/components/activities/activity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";

type ProjectActivitiesProps = {
  accordionSelectedValue?: string;
  project?: Project;
  isVisible?: boolean;
};

const ProjectActivities: FC<ProjectActivitiesProps> = ({
  accordionSelectedValue,
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
      accordionSelectedValue={accordionSelectedValue}
      isVisible={isVisible}
    >
      <div className="space-y-2">
        <Button onClick={() => createProjectActivity(project.id)}>
          <Plus />
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
