import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import MeetingRecord from "./meeting";

type MeetingAccordionItemProps = {
  meeting: Meeting;
  accordionSelectedValue?: string;
};

const MeetingAccordionItem: FC<MeetingAccordionItemProps> = ({
  meeting,
  accordionSelectedValue,
}) => {
  const { getNamesByIds } = usePeople();

  return (
    <DefaultAccordionItem
      value={meeting.id}
      triggerTitle={`${meeting.topic} (${format(meeting.meetingOn, "Pp")})`}
      className="tracking-tight"
      accordionSelectedValue={accordionSelectedValue}
      link={`/meetings/${meeting.id}`}
      triggerSubTitle={[
        meeting.participantIds.length > 0 &&
          `Participants: ${getNamesByIds(meeting.participantIds)}`,
      ]}
    >
      <MeetingRecord meeting={meeting} />
    </DefaultAccordionItem>
  );
};

export default MeetingAccordionItem;
