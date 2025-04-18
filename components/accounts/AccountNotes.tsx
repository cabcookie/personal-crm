import useAccountActivities from "@/api/useAccountActivities";
import { FC } from "react";
import LeanActivitiy from "../activities/activity-lean";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";

type AccountNotesProps = {
  accountId: string;
};

const AccountNotes: FC<AccountNotesProps> = ({ accountId }) => {
  const { activities } = useAccountActivities(accountId);

  return (
    <DefaultAccordionItem value="notes" triggerTitle="Notes">
      <div className="space-y-10">
        {activities?.map((a) => (
          <LeanActivitiy key={a.id} activity={a} readonly />
        ))}
      </div>
    </DefaultAccordionItem>
  );
};

export default AccountNotes;
