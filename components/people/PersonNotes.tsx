import usePersonActivities from "@/api/usePersonActivities";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type PersonNotesProps = {
  personId: string;
  showNotes?: boolean;
  accordionSelectedValue?: string;
};

const PersonNotes: FC<PersonNotesProps> = ({
  showNotes,
  accordionSelectedValue,
  personId,
}) => {
  const { activities } = usePersonActivities(personId);

  return (
    <DefaultAccordionItem
      value="Notes"
      triggerTitle="Notes"
      isVisible={!!showNotes}
      accordionSelectedValue={accordionSelectedValue}
    >
      {activities?.map((a) => (
        <ActivityComponent
          key={a}
          activityId={a}
          showDates
          showMeeting
          showProjects
          section="Person Notes"
        />
      ))}
    </DefaultAccordionItem>
  );
};

export default PersonNotes;
