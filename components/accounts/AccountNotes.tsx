import useAccountActivities from "@/api/useAccountActivities";
import { FC } from "react";
import ActivityComponent from "../activities/activity";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type AccountNotesProps = {
  accountId: string;
};

const AccountNotes: FC<AccountNotesProps> = ({ accountId }) => {
  const { activities } = useAccountActivities(accountId);

  return (
    <DefaultAccordionItem value="notes" triggerTitle="Notes">
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
