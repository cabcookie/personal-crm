import { postponeTodo } from "@/api/dayplan/postpone-todo";
import { ProjectTodo } from "@/api/useProjectTodos";
import { cn } from "@/lib/utils";
import { Calendar, CalendarOff, Loader2 } from "lucide-react";
import { FC, useState } from "react";

interface PostPoneBtnProps {
  dayPlanId: string;
  todo: ProjectTodo;
  mutate: (postponed: boolean, refresh: boolean) => void;
  status: "OPEN" | "DONE" | "POSTPONED";
}

const PostPoneBtn: FC<PostPoneBtnProps> = ({
  dayPlanId,
  todo,
  mutate,
  status,
}) => {
  const [isPostponing, setIsPostponing] = useState(false);

  const handlePostPone = (postponed: boolean) => async () => {
    setIsPostponing(true);
    await postponeTodo({
      data: { dayPlanId, todoId: todo.todoId, postponed },
      options: {
        mutate: (refresh) => mutate(postponed, refresh),
        confirm: () => setIsPostponing(false),
      },
    });
  };

  const CalenderIcon = status === "POSTPONED" ? CalendarOff : Calendar;
  const CalenderIconHover = status !== "POSTPONED" ? CalendarOff : Calendar;

  const iconSize = "w-4 h-4";

  return isPostponing ? (
    <Loader2 className={cn(iconSize, "text-muted-foreground animate-spin")} />
  ) : (
    <div className="cursor-pointer hover:children:hidden group">
      <CalenderIcon
        className={cn(iconSize, "text-muted-foreground group-hover:hidden")}
      />
      <CalenderIconHover
        className={cn(iconSize, "text-primary hidden group-hover:block")}
        onClick={handlePostPone(status !== "POSTPONED")}
      />
    </div>
  );
};

export default PostPoneBtn;
