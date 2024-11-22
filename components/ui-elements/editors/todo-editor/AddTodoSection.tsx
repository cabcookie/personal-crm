import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import { ChevronUpCircle, PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import TodoEditor from "./TodoEditor";

type AddTodoSectionProps = {
  className?: string;
  onSave: (json: JSONContent) => Promise<string | undefined>;
};

const AddTodoSection: FC<AddTodoSectionProps> = ({ className, onSave }) => {
  const [showTodoEditor, setShowTodoEditor] = useState(false);

  const saveItem = async (json: JSONContent) => {
    const todoId = await onSave(json);
    if (!todoId) return;
    setShowTodoEditor(false);
    return todoId;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowTodoEditor((val) => !val)}
      >
        {!showTodoEditor ? (
          <PlusCircle className="w-4 h-4 mr-1" />
        ) : (
          <ChevronUpCircle className="w-4 h-4 mr-1" />
        )}
        {!showTodoEditor ? "Add todo…" : "Hide todo editor"}
      </Button>

      {showTodoEditor && <TodoEditor onSave={saveItem} />}
    </div>
  );
};

export default AddTodoSection;
