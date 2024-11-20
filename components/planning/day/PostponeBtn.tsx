import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FC, useState } from "react";

type PostponeBtnProps = {
  postponeTodo: (todoId: string) => void;
  label: string;
  todoId: string;
};

const PostponeBtn: FC<PostponeBtnProps> = ({ postponeTodo, todoId, label }) => {
  const [saveDecision, setSaveDecision] = useState(false);

  const onPostpone = async () => {
    setSaveDecision(true);
    await postponeTodo(todoId);
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPostpone}
        disabled={saveDecision}
      >
        {label}
      </Button>
      {saveDecision && (
        <Loader2 className="mt-2 w-5 h-5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};

export default PostponeBtn;
