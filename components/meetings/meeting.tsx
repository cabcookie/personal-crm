import { Meeting } from "@/api/useMeetings";
import { FC, useState } from "react";
import { Accordion } from "../ui/accordion";
import MeetingActivityList from "./meeting-activity-list";
import MeetingParticipants from "./meeting-participants";

type MeetingRecordProps = {
  meeting: Meeting;
};

const MeetingRecord: FC<MeetingRecordProps> = ({ meeting }) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <MeetingParticipants
          participantIds={meeting.participantIds}
          accordionSelectedValue={accordionValue}
        />

        <MeetingActivityList
          meeting={meeting}
          accordionSelectedValue={accordionValue}
        />
      </Accordion>
    </div>
  );
};

export default MeetingRecord;
