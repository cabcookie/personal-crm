import { CheckCircle2, Circle } from "lucide-react";
import { FC } from "react";
import { Badge } from "../ui/badge";

type TaskBadgeProps = {
  hasOpenTasks?: boolean;
  hasClosedTasks: boolean;
};

const TaskBadge: FC<TaskBadgeProps> = ({ hasClosedTasks, hasOpenTasks }) =>
  hasOpenTasks ? (
    <>
      <Circle className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden bg-destructive rounded-full text-destructive-foreground" />
      <Badge variant="destructive" className="hidden md:block">
        Open
      </Badge>
    </>
  ) : (
    hasClosedTasks && (
      <>
        <CheckCircle2 className="mt-[0.2rem] w-4 min-w-4 h-4 md:hidden rounded-full bg-constructive text-constructive-foreground" />
        <Badge className="hidden md:block bg-constructive text-constructive-foreground">
          Done
        </Badge>
      </>
    )
  );

export default TaskBadge;
