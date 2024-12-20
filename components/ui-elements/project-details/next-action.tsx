import { finishTodo } from "@/api/todos/finish-todo";
import { Todo } from "@/api/useProjectTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { FC } from "react";
import SimpleReadOnly from "../editors/simple-visualizer/SimpleReadOnly";
import NextActionDetailBtn from "./next-action-detail-btn";

interface NextActionProps {
  todo: Todo;
  mutate: (todo: Todo, refresh: boolean) => void;
}

const NextAction: FC<NextActionProps> = ({ todo, mutate }) => {
  const onFinish = () =>
    finishTodo({
      data: { todoId: todo.todoId, done: !todo.done },
      options: {
        mutate: (refresh) => mutate({ ...todo, done: !todo.done }, refresh),
      },
    });

  return (
    <div className="flex flex-row gap-1 items-start">
      <>
        <div className="w-6 min-w-6 mt-[0.8rem]">
          <Checkbox checked={todo.done} onCheckedChange={onFinish} />
        </div>

        <div className="flex-1">
          <SimpleReadOnly content={todo.todo.content || []} />
          <NextActionDetailBtn todo={todo} />
        </div>
      </>
    </div>
  );
};

export default NextAction;
