import { OpenTask } from "@/api/ContextOpenTasks";
import { Meeting } from "@/api/useMeetings";
import {
  getTasksByActivities,
  getTextFromEditorJsonContent,
} from "@/helpers/ui-notes-writer";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NextAction from "../ui-elements/project-details/next-action";
import { Accordion } from "../ui/accordion";

type MeetingNextActionsProps = {
  meeting: Meeting;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ meeting }) => {
  const [tasks] = useState(getTasksByActivities(meeting.activities));

  const getTasksText = ({ task }: OpenTask) =>
    getTextFromEditorJsonContent(task).trim();

  return (
    tasks.length > 0 && (
      <DefaultAccordionItem
        value="next-actions"
        triggerTitle="Agreed Next Actions"
        triggerSubTitle={tasks.map(getTasksText)}
      >
        <Accordion type="single" collapsible>
          {tasks.map((task) => (
            <NextAction
              key={`${task.activityId}-${task.index}`}
              openTask={task}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MeetingNextActions;
