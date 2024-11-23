import { cn } from "@/lib/utils";
import { FC } from "react";
import { WorkflowStatus } from "./inboxWorkflow";

type ConfirmContentProps = {
  status: WorkflowStatus;
  className?: string;
};

const relevantStatuses: WorkflowStatus[] = ["addToProject", "addToPerson"];

const ConfirmContent: FC<ConfirmContentProps> = ({ status, className }) =>
  relevantStatuses.includes(status) && (
    <div
      className={cn("text-destructive px-2 font-semibold text-sm", className)}
    >
      Make sure you have updated the content before confirming where to move it:
    </div>
  );

export default ConfirmContent;
