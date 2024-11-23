import { FC } from "react";
import { WorkflowStep } from "./inboxWorkflow";

type InboxDecisionHeaderProps = {
  step: WorkflowStep;
};

const InboxDecisionHeader: FC<InboxDecisionHeaderProps> = ({ step }) => (
  <>
    <div className="flex flex-row items-baseline font-semibold translate-y-1">
      <step.StepIcon className="w-4 h-4 mr-2" />
      {step.statusName}
    </div>
    <div>{step.question}</div>
  </>
);

export default InboxDecisionHeader;
