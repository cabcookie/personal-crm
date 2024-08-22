import { useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos from "@/api/useMeetingTodos";
import { flow, get, join, map } from "lodash/fp";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { getTextFromEditorJsonContent } from "../ui-elements/editors/helpers/text-generation";

type MeetingActivityListProps = {
  meeting: Meeting;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({ meeting }) => {
  const { getProjectNamesByIds } = useProjectsContext();
  const { meetingTodos } = useMeetingTodos(meeting.id);

  return meeting.activities.length === 0 ? (
    <div className="mx-2 md:mx-4 mt-8 font-semibold text-sm text-muted-foreground md:text-center">
      Select a project to start taking notes!
    </div>
  ) : (
    meeting.activities.map((a) => (
      <DefaultAccordionItem
        value={a.id}
        key={a.id}
        badge={
          <TaskBadge
            hasOpenTasks={meetingTodos?.some((t) => !t.done)}
            hasClosedTasks={meetingTodos?.every((t) => t.done)}
          />
        }
        triggerTitle={getProjectNamesByIds(a.projectIds)}
        triggerSubTitle={`Next actions: ${flow(
          map(get("todo")),
          map(getTextFromEditorJsonContent),
          join(", ")
        )(meetingTodos)}`}
      >
        <ActivityComponent
          activityId={a.id}
          showMeeting={false}
          notesNotInAccordion
        />
      </DefaultAccordionItem>
    ))
  );
};

export default MeetingActivityList;
