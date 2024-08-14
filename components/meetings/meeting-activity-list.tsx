import { useProjectsContext } from "@/api/ContextProjects";
import { Meeting } from "@/api/useMeetings";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
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
