import { useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import { getTextFromEditorJsonContent } from "@/helpers/ui-notes-writer";
import { flow, join, map } from "lodash/fp";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import TaskBadge from "../task/TaskBadge";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type MeetingActivityListProps = {
  meeting: Meeting;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({ meeting }) => {
  const { getProjectNamesByIds } = useProjectsContext();

  return meeting.activities.length === 0 ? (
    <div className="mx-2 md:mx-4 mt-8 font-semibold text-sm text-muted-foreground md:text-center">
      Select a project to start taking notes!
    </div>
  ) : (
    meeting.activities.map((a) => (
      <DefaultAccordionItem
        value={a.id}
        key={a.id}
        triggerTitle={getProjectNamesByIds(a.projectIds)}
        badge={
          <TaskBadge
            hasOpenTasks={a.hasOpenTasks}
            hasClosedTasks={!!a.closedTasks?.length}
          />
        }
        triggerSubTitle={`Next actions: ${flow(
          map(getTextFromEditorJsonContent),
          join(", ")
        )(a.openTasks)}`}
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
