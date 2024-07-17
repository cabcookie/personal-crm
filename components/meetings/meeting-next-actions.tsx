import { OpenTask, useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Meeting } from "@/api/useMeetings";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NextAction from "../ui-elements/project-details/next-action";
import { Accordion } from "../ui/accordion";

type MeetingNextActionsProps = {
  meeting: Meeting;
  accordionSelectedValue?: string;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({
  meeting,
  accordionSelectedValue,
}) => {
  const { openTasks } = useOpenTasksContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const getOpenTasksFromMeetingActivities = () =>
    openTasks?.filter((task) => task.meetingId === meeting.id);

  const getTasksText = ({ openTask }: OpenTask) =>
    getTextFromEditorJsonContent(openTask).trim();

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Agreed Next Actions"
      triggerSubTitle={getOpenTasksFromMeetingActivities()?.map(getTasksText)}
      accordionSelectedValue={accordionSelectedValue}
    >
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {!getOpenTasksFromMeetingActivities()?.length && "No open tasks"}
        {getOpenTasksFromMeetingActivities()?.map((openTask) => (
          <NextAction
            key={`${openTask.activityId}-${openTask.index}`}
            openTask={openTask}
            accordionSelectedValue={accordionValue}
            showMeeting
          />
        ))}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default MeetingNextActions;
