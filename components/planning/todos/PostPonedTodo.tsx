import { ProjectTodo } from "@/api/useProjectTodos";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { Checkbox } from "@/components/ui/checkbox";
import { FC } from "react";
import PostponeBtn from "../day/PostponeBtn";

type PostPonedTodoProps = {
  todo: ProjectTodo;
  postponeTodo?: (todoId: string) => void;
};

const PostPonedTodo: FC<PostPonedTodoProps> = ({ todo, postponeTodo }) => (
  <>
    <div className="flex flex-row gap-1 items-start mt-4">
      <div className="w-6 min-w-6">
        <Checkbox
          checked={todo.done}
          onCheckedChange={() => {}}
          className="border-gray-300"
        />
      </div>
      <div className="flex-1">
        <div className="line-through">
          {getTextFromJsonContent({ type: "doc", content: todo.todo.content })}
        </div>
        {!todo.done && postponeTodo && (
          <PostponeBtn
            label="Handle today"
            postponeTodo={postponeTodo}
            todoId={todo.todoId}
          />
        )}
      </div>
    </div>
  </>
);

export default PostPonedTodo;
