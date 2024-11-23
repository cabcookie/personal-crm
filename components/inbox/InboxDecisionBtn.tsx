import { FC } from "react";
import { Button } from "../ui/button";
import { WorkflowStepIcon } from "./inboxWorkflow";

type InboxDecisionBtnProps = {
  Icon: WorkflowStepIcon;
  label: string;
  onClick: () => void;
};

const InboxDecisionBtn: FC<InboxDecisionBtnProps> = ({
  Icon,
  label,
  onClick,
}) => (
  <Button onClick={onClick} variant="outline" size="sm">
    <Icon className="w-4 h-4 mr-1" />
    {label}
  </Button>
);

export default InboxDecisionBtn;
