import { CheckCircle2 } from "lucide-react";
import { FC } from "react";
import AccordionItemBadge from "../accordion-item-badge/badge";

type TaskBadgeProps = {
  hasOpenTasks?: boolean;
  hasClosedTasks?: boolean;
};

const TaskBadge: FC<TaskBadgeProps> = ({ hasClosedTasks, hasOpenTasks }) =>
  hasOpenTasks ? (
    <AccordionItemBadge badgeLabel="Open" className="bg-destructive" />
  ) : (
    hasClosedTasks && (
      <AccordionItemBadge
        badgeLabel="Done"
        Icon={CheckCircle2}
        className="bg-constructive"
      />
    )
  );

export default TaskBadge;
