import { ProjectTodo } from "@/api/useProjectTodos";
import SimpleReadOnly from "@/components/ui-elements/editors/simple-visualizer/SimpleReadOnly";
import { Checkbox } from "@/components/ui/checkbox";
import { getTodoContent } from "@/helpers/todos";
import { FC, ReactNode } from "react";

type DailyPlanProjectTodoProps = {
  todo: ProjectTodo;
  finishTodo?: (done: boolean) => void;
  children?: ReactNode;
};

const DailyPlanProjectTodo: FC<DailyPlanProjectTodoProps> = ({
  todo,
  finishTodo,
  children,
}) => {
  return (
    <div className="flex flex-row gap-1 items-start">
      {finishTodo && (
        <>
          <div className="w-6 min-w-6 mt-[0.6rem]">
            <Checkbox
              checked={todo.done}
              onCheckedChange={finishTodo}
              className=""
            />
          </div>
          <div className="flex-1">
            <SimpleReadOnly
              content={getTodoContent(
                todo.todo.content,
                false,
                todo.activityId
              )}
            />
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyPlanProjectTodo;
