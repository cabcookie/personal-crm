import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { format } from "date-fns";
import { map } from "lodash/fp";
import { FC } from "react";
import MeetingAccordionItem from "../meetings/MeetingAccordionItem";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";

type ActivityMeetingListProps = {
  meeting?: Meeting;
  showMeeting?: boolean;
};

const ActivityMeetingList: FC<ActivityMeetingListProps> = ({
  meeting,
  showMeeting,
}) => {
  const { getPeopleByIds } = usePeople();

  return (
    meeting && (
      <DefaultAccordionItem
        value="meetings"
        triggerTitle="For meeting"
        triggerSubTitle={[
          meeting?.topic,
          meeting?.meetingOn && `On: ${format(meeting?.meetingOn, "PPp")}`,
          // Resolve participant names on demand (cache-backed), no full list.
          ...map("name")(getPeopleByIds(meeting?.participantIds)),
        ]}
        className="tracking-tight"
        isVisible={showMeeting && !!meeting}
      >
        <Accordion type="single" collapsible>
          <MeetingAccordionItem meeting={meeting} />
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default ActivityMeetingList;
