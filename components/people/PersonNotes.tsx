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
  const { activityIds } = usePersonActivities(personId);

  return (
    <DefaultAccordionItem
      value="Notes"
      triggerTitle="Notes"
      isVisible={!!showNotes}
      accordionSelectedValue={accordionSelectedValue}
    >
      {activityIds?.map((a) => (
        <ActivityComponent
          key={a}
          activityId={a}
          showDates
          showMeeting
          showProjects
        />
      ))}
    </DefaultAccordionItem>
  );
};

export default PersonNotes;
