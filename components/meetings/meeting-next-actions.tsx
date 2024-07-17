import { OpenTask, useOpenTasksContext } from "@/api/ContextOpenTasks";
import { Activity } from "@/api/useActivity";
import { Meeting } from "@/api/useMeetings";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { flatMap, flow, map, uniqBy } from "lodash/fp";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import NextAction from "../ui-elements/project-details/next-action";
import { Accordion } from "../ui/accordion";

type MeetingNextActionsProps = {
  meeting: Meeting;
};

const MeetingNextActions: FC<MeetingNextActionsProps> = ({ meeting }) => {
  const { openTasksByProjectId } = useOpenTasksContext();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  const getOpenTasksFromMeetingActivities = () =>
    flow(
      flatMap((activity: Activity) => activity.projectIds),
      flatMap(openTasksByProjectId),
      uniqBy(({ activityId, index }) => `${activityId}-${index}`)
    )(meeting.activities);

  const getTasksText = ({ openTask }: OpenTask) =>
    getTextFromEditorJsonContent(openTask).trim();

  return (
    <DefaultAccordionItem
      value="next-actions"
      triggerTitle="Agreed Next Actions"
      triggerSubTitle={flow(
        getOpenTasksFromMeetingActivities,
        map(getTasksText)
      )()}
    >
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        {flow(
          getOpenTasksFromMeetingActivities,
          map((openTask) => (
            <NextAction
              key={`${openTask.activityId}-${openTask.index}`}
              openTask={openTask}
              accordionSelectedValue={accordionValue}
              showMeeting
            />
          ))
        )()}
      </Accordion>
    </DefaultAccordionItem>
  );
};

export default MeetingNextActions;
