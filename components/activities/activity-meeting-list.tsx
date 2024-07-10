import { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { Person } from "@/api/usePerson";
import { format } from "date-fns";
import { filter, flow, map } from "lodash/fp";
import { FC, useState } from "react";
import MeetingAccordionItem from "../meetings/MeetingAccordionItem";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";

type ActivityMeetingListProps = {
  meeting?: Meeting;
  accordionSelectedValue?: string;
  showMeeting?: boolean;
};

const ActivityMeetingList: FC<ActivityMeetingListProps> = ({
  meeting,
  accordionSelectedValue,
  showMeeting,
}) => {
  const { people } = usePeople();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    meeting && (
      <DefaultAccordionItem
        value="meetings"
        triggerTitle="For meeting"
        triggerSubTitle={[
          meeting?.topic,
          meeting?.meetingOn && `On: ${format(meeting?.meetingOn, "PPp")}`,
          ...flow(
            filter(
              (person: Person) => !!meeting?.participantIds.includes(person.id)
            ),
            map((p) => p.name)
          )(people),
        ]}
        className="tracking-tight"
        accordionSelectedValue={accordionSelectedValue}
        isVisible={showMeeting && !!meeting}
      >
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
      </DefaultAccordionItem>
    )
  );
};

export default ActivityMeetingList;
