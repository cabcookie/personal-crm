import { ProjectTodo } from "@/api/useProjectTodos";
import { cn } from "@/lib/utils";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import PostPoneBtn from "./postpone-btn";

interface DailyPlanProjectTodoMenuProps {
  dayPlanId: string;
  todo: ProjectTodo;
  mutate: (postponed: boolean, refresh: boolean) => void;
  status: "OPEN" | "DONE" | "POSTPONED";
}

const DailyPlanProjectTodoMenu: FC<DailyPlanProjectTodoMenuProps> = ({
  dayPlanId,
  todo,
  mutate,
  status,
}) => {
  const iconStyle = "w-4 h-4 text-muted-foreground";

  return (
    <div className="flex flex-row gap-1">
      {status !== "DONE" && (
        <PostPoneBtn {...{ dayPlanId, todo, status, mutate }} />
      )}

      <Link href={`/activities/${todo.activityId}`} target="_blank">
        <ArrowUpRightFromSquare
          className={cn(iconStyle, "hover:text-primary")}
        />
      </Link>
    </div>
  );
};

export default DailyPlanProjectTodoMenu;
