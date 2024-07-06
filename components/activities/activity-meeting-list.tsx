import { Meeting } from "@/api/useMeetings";
import { FC, useState } from "react";
import MeetingAccordionItem from "../meetings/MeetingAccordionItem";
import { Accordion } from "../ui/accordion";

type ActivityMeetingListProps = {
  meeting?: Meeting;
};

const ActivityMeetingList: FC<ActivityMeetingListProps> = ({ meeting }) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return !meeting ? (
    "Loading…"
  ) : (
    <div>
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={(val) =>
          setAccordionValue(val === accordionValue ? undefined : val)
        }
      >
        <MeetingAccordionItem
          meeting={meeting}
          accordionSelectedValue={accordionValue}
        />
      </Accordion>
    </div>
  );
};

export default ActivityMeetingList;
