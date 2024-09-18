import { useProjectsContext } from "@/api/ContextProjects";
import { Activity } from "@/api/useActivity";
import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { format } from "date-fns";
import { some } from "lodash";
import { flatMap, flow, map } from "lodash/fp";
import { FC } from "react";
import ActivityFormatBadge from "../activities/activity-format-badge";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import MeetingRecord from "./meeting";

type MeetingAccordionItemProps = {
  meeting: Meeting;
};

const MeetingAccordionItem: FC<MeetingAccordionItemProps> = ({ meeting }) => {
  const { getNamesByIds } = usePeople();
  const { getProjectNamesByIds } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value={meeting.id}
      triggerTitle={`${meeting.topic} (${format(meeting.meetingOn, "Pp")})`}
      className="tracking-tight"
      link={`/meetings/${meeting.id}`}
      badge={
        <>
          <TaskBadge
            hasOpenTasks={
              !meeting.immediateTasksDone ||
              some(meeting.activities, "hasOpenTodos")
            }
            hasClosedTasks={some(meeting.activities, "hasClosedTodos")}
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
            map("notes"),
            map(getTextFromJsonContent)
          )(meeting.activities)}`,
      ]}
    >
      <MeetingRecord meeting={meeting} />
    </DefaultAccordionItem>
  );
};

export default MeetingAccordionItem;
