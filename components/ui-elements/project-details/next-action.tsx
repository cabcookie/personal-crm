import { OpenTask } from "@/api/ContextOpenTasks";
import { useProjectsContext } from "@/api/ContextProjects";
import ActivityComponent from "@/components/activities/activity";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { FC } from "react";
import DefaultAccordionItem from "../accordion/DefaultAccordionItem";

type NextActionProps = {
  openTask: OpenTask;
  showProjects?: boolean;
  showMeeting?: boolean;
};

const NextAction: FC<NextActionProps> = ({
  openTask: { activityId, index, openTask, projectIds },
  showMeeting,
  showProjects,
}) => {
  const { getProjectNamesByIds } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value={`${activityId}-${index}`}
      triggerTitle={`Todo: ${getTextFromEditorJsonContent(openTask)}`}
      triggerSubTitle={
        showProjects && projectIds && getProjectNamesByIds(projectIds)
      }
    >
      <ActivityComponent
        activityId={activityId}
        showDates
        showMeeting={showMeeting}
        showProjects={showProjects}
      />
    </DefaultAccordionItem>
  );
};

export default NextAction;
