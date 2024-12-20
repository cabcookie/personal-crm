import { ProjectTodo } from "@/api/useProjectTodos";
import NextActionDetailBtn from "@/components/ui-elements/project-details/next-action-detail-btn";
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
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "DONE" && (
        <PostPoneBtn {...{ dayPlanId, todo, status, mutate }} />
      )}

      <NextActionDetailBtn {...{ todo }} />
    </div>
  );
};

export default DailyPlanProjectTodoMenu;
