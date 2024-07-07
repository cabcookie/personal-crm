import useAccountActivities from "@/api/useAccountActivities";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type AccountNotesProps = {
  accountId: string;
  accordionSelectedValue?: string;
};

const AccountNotes: FC<AccountNotesProps> = ({
  accountId,
  accordionSelectedValue,
}) => {
  const { activities } = useAccountActivities(accountId);

  return (
    <DefaultAccordionItem
      value="notes"
      triggerTitle="Notes"
      accordionSelectedValue={accordionSelectedValue}
    >
      {activities?.map((a) => (
        <ActivityComponent
          key={a.id}
          activityId={a.id}
          showDates
          showMeeting
          showProjects
        />
      ))}
    </DefaultAccordionItem>
  );
};

export default AccountNotes;
