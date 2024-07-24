import { OpenTask, useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Meeting } from "@/api/useMeetings";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NextAction from "../ui-elements/project-details/next-action";
import { Accordion } from "../ui/accordion";

type MeetingNextActionsProps = {
  meeting: Meeting;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ meeting }) => {
  const { openTasks } = useOpenTasksContext();

  const getOpenTasksFromMeetingActivities = () =>
    openTasks?.filter((task) => task.meetingId === meeting.id) ?? [];

  const getTasksText = ({ task }: OpenTask) =>
    getTextFromEditorJsonContent(task).trim();

  return (
    getOpenTasksFromMeetingActivities().length > 0 && (
      <DefaultAccordionItem
        value="next-actions"
        triggerTitle="Agreed Next Actions"
        triggerSubTitle={getOpenTasksFromMeetingActivities()?.map(getTasksText)}
      >
        <Accordion type="single" collapsible>
          {getOpenTasksFromMeetingActivities().map((openTask) => (
            <NextAction
              key={`${openTask.activityId}-${openTask.index}`}
              openTask={openTask}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MeetingNextActions;
