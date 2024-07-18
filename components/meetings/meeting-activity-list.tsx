import { Meeting } from "@/api/useMeetings";
import { FC } from "react";
import ActivityComponent from "../activities/activity";

type MeetingActivityListProps = {
  meeting: Meeting;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({ meeting }) =>
  meeting.activities.length === 0 ? (
    <div className="mx-2 md:mx-4 mt-8 font-semibold text-sm text-muted-foreground md:text-center">
      Select a project to start taking notes!
    </div>
  ) : (
    meeting.activities.map((a) => (
      <ActivityComponent
        key={a.id}
        activityId={a.id}
        showMeeting={false}
        notesNotInAccordion
      />
    ))
  );

export default MeetingActivityList;
