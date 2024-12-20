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

  const label = status === "POSTPONED" ? "Activate todo" : "Pause todo";

  const iconSize = "w-4 h-4";

  return isPostponing ? (
    <Loader2 className={cn(iconSize, "text-muted-foreground animate-spin")} />
  ) : (
    <div className="w-28 cursor-pointer hover:children:hidden group">
      <div className="flex flex-row gap-1 text-muted-foreground group-hover:hidden">
        <CalenderIcon className={iconSize} />
        <span className="text-sm -translate-y-0.5">{label}</span>
      </div>
      <div className="flex-row gap-1 text-primary hidden group-hover:flex">
        <CalenderIconHover
          className={iconSize}
          onClick={handlePostPone(status !== "POSTPONED")}
        />
        <span className="text-sm -translate-y-0.5">{label}</span>
      </div>
    </div>
  );
};

export default PostPoneBtn;
