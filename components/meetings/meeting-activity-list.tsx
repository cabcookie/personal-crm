import { FC, useState } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import { Accordion } from "../ui/accordion";

type MeetingActivityListProps = {
  activityIds: string[];
  accordionSelectedValue?: string;
};

const MeetingActivityList: FC<MeetingActivityListProps> = ({
  accordionSelectedValue,
  activityIds,
}) => {
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  return (
    activityIds.length > 0 && (
      <DefaultAccordionItem
        value="notes"
        triggerTitle="Notes"
        className="tracking-tight"
        accordionSelectedValue={accordionSelectedValue}
      >
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={(val) =>
            setAccordionValue(val === accordionValue ? undefined : val)
          }
        >
          {activityIds?.map((activityId) => (
            <ActivityComponent
              key={activityId}
              activityId={activityId}
              showMeeting={false}
            />
          ))}
        </Accordion>
      </DefaultAccordionItem>
    )
  );
};

export default MeetingActivityList;
