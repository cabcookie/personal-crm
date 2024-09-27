import { JSONContent } from "@tiptap/core";
import { FC } from "react";
import { getTextFromJsonContent } from "../ui-elements/editors/helpers/text-generation";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

type PostPonedTodoProps = {
  done: boolean;
  content?: JSONContent[] | undefined;
  postponeTodo: () => void;
};

const PostPonedTodo: FC<PostPonedTodoProps> = ({
  done,
  content,
  postponeTodo,
}) => (
  <>
    <div className="flex flex-row gap-1 items-start mt-4">
      <div className="w-6 min-w-6">
        <Checkbox
          checked={done}
          onCheckedChange={() => {}}
          className="border-gray-300"
        />
      </div>
      <div className="flex-1">
        <div className="line-through">
          {getTextFromJsonContent({ type: "doc", content })}
        </div>
        {!done && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => postponeTodo()}
            className="mt-2"
          >
            Handle today
          </Button>
        )}
      </div>
    </div>
  </>
);

export default PostPonedTodo;
