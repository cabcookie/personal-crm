import { DayPlanTodo } from "@/api/useDayplans";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { IoCheckboxSharp, IoSquareOutline } from "react-icons/io5";
import ProjectName from "../ui-elements/tokens/project-name";

type TaskProps = {
  todo: DayPlanTodo;
  switchTodoDone: (taskId: string, done: boolean) => void;
};

const Task: FC<TaskProps> = ({
  todo: { id, todo, done, projectId },
  switchTodoDone,
}) => {
  const Icon = done ? IoCheckboxSharp : IoSquareOutline;

  return (
    <article className="flex flex-row mt-2 text-base md:text-lg ml-6 gap-2">
      <Icon
        className="mt-1 cursor-pointer"
        onClick={() => switchTodoDone(id, done)}
      />
      <div className={cn(done && "line-through")}>
        <div>{todo}</div>
        {projectId && (
          <div className="text-muted-foreground">
            <ProjectName projectId={projectId} />
          </div>
        )}
      </div>
    </article>
  );
};

export default Task;
