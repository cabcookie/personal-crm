import { Meeting } from "@/api/useMeetings";
import { FC } from "react";
import ActivityComponent from "../activities/activity";

type MeetingActivityListProps = {
  meeting: Meeting;
  accordionSelectedValue?: string;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({
  accordionSelectedValue,
  meeting,
}) =>
  meeting.activities.length > 0 &&
  meeting.activities.map((a) => (
    <ActivityComponent
      key={a.id}
      activityId={a.id}
      showMeeting={false}
      notesNotInAccordion
      accordionSelectedValue={accordionSelectedValue}
    />
  ));

export default MeetingActivityList;
