import { finishTodo } from "@/api/todos/finish-todo";
import { ProjectTodo } from "@/api/useProjectTodos";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import SimpleReadOnly from "@/components/ui-elements/editors/simple-visualizer/SimpleReadOnly";
import { Checkbox } from "@/components/ui/checkbox";
import { FC } from "react";
import DailyPlanProjectTodoMenu from "./DailyPlanProjectTodoMenu";

interface DailyPlanTodo {
  todoId: string;
  postPoned?: boolean;
  done?: boolean;
}

interface DailyPlanProjectTodoProps {
  dayPlanId: string;
  todo: ProjectTodo;
  mutate: (todo: DailyPlanTodo, refresh: boolean) => void;
  status: "OPEN" | "DONE" | "POSTPONED";
}

const DailyPlanProjectTodo: FC<DailyPlanProjectTodoProps> = ({
  dayPlanId,
  todo,
  mutate,
  status,
}) => {
  const onFinish = () =>
    finishTodo({
      data: { todoId: todo.todoId, done: !todo.done },
      options: {
        mutate: (refresh) =>
          mutate({ todoId: todo.todoId, done: !todo.done }, refresh),
      },
    });

  return (
    <div className="flex flex-row gap-1 items-start">
      <>
        <div className="w-6 min-w-6 mt-[0.6rem]">
          <Checkbox
            checked={todo.done}
            disabled={status === "POSTPONED"}
            onCheckedChange={onFinish}
          />
        </div>

        <div className="flex-1">
          {status !== "POSTPONED" && (
            <SimpleReadOnly content={todo.todo.content || []} />
          )}

          {status === "POSTPONED" && (
            <div className="line-through mt-2">
              {getTextFromJsonContent({
                type: "doc",
                content: todo.todo.content,
              })}
            </div>
          )}

          <DailyPlanProjectTodoMenu
            {...{
              dayPlanId,
              todo,
              finishTodo,
              status,
              mutate: (postPoned, refresh) =>
                mutate({ todoId: todo.todoId, postPoned }, refresh),
            }}
          />
        </div>
      </>
    </div>
  );
};

export default DailyPlanProjectTodo;
