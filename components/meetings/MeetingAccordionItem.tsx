import { useProjectsContext } from "@/api/ContextProjects";
import { Activity } from "@/api/useActivity";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos from "@/api/useMeetingTodos";
import usePeople from "@/api/usePeople";
import { format } from "date-fns";
import { flatMap, flow, get, map } from "lodash/fp";
import { FC } from "react";
import ActivityFormatBadge from "../activities/activity-format-badge";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/editors/helpers/text-generation";
import MeetingRecord from "./meeting";

type MeetingAccordionItemProps = {
  meeting: Meeting;
};

const MeetingAccordionItem: FC<MeetingAccordionItemProps> = ({ meeting }) => {
  const { getNamesByIds } = usePeople();
  const { getProjectNamesByIds } = useProjectsContext();
  const { meetingTodos } = useMeetingTodos(meeting.id);

  return (
    <DefaultAccordionItem
      value={meeting.id}
      triggerTitle={`${meeting.topic} (${format(meeting.meetingOn, "Pp")})`}
      className="tracking-tight"
      link={`/meetings/${meeting.id}`}
      badge={
        <>
          <TaskBadge
            hasOpenTasks={meetingTodos?.some((t) => !t.done)}
            hasClosedTasks={meetingTodos?.every((t) => t.done)}
          />
          {meeting.hasOldVersionFormattedActivities && <ActivityFormatBadge />}
        </>
      }
      triggerSubTitle={[
        meeting.participantIds.length > 0 &&
          `Participants: ${getNamesByIds(meeting.participantIds)}`,
        meeting.activities.flatMap((a) => a.projectIds).length > 0 &&
          `Projects: ${flow(
            flatMap((a: Activity) => a.projectIds),
            getProjectNamesByIds
          )(meeting.activities)}`,
        meeting.activities.length > 0 &&
          `Notes: ${flow(
            map(get("notes")),
            map(getTextFromEditorJsonContent)
          )(meeting.activities)}`,
      ]}
    >
      <MeetingRecord meeting={meeting} />
    </DefaultAccordionItem>
  );
};

export default MeetingAccordionItem;
