import ProcessInboxItem from "@/components/inbox/ProcessInboxItem";
import PlanWeekAction from "@/components/planning/week/PlanWeekAction";

const ProcessInbox = () => (
  <>
    <PlanWeekAction label="Process Inbox Items" />
    <ProcessInboxItem />
  </>
);

export default ProcessInbox;
