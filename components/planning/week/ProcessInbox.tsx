import ProcessInboxItem from "@/components/inbox/ProcessInboxItem";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";
import { FC } from "react";

interface ProcessInboxProps {
  skipInbox?: () => void;
}

const ProcessInbox: FC<ProcessInboxProps> = ({ skipInbox }) => (
  <>
    <PlanWeekAction label="Process Inbox Items" skip={skipInbox} />
    <ProcessInboxItem />
  </>
);

export default ProcessInbox;
