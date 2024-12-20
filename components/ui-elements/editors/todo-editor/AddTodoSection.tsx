import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import { ChevronUpCircle, PlusCircle } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import TodoEditor from "./TodoEditor";

type AddTodoSectionProps = {
  className?: string;
  onSave: (json: JSONContent) => Promise<string | undefined>;
  formControl?: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  };
};

const AddTodoSection: FC<AddTodoSectionProps> = ({
  className,
  onSave,
  formControl,
}) => {
  const [showTodoEditor, setShowTodoEditor] = useState(false);

  const saveItem = async (json: JSONContent) => {
    const todoId = await onSave(json);
    if (!todoId) return;
    if (formControl) formControl.setOpen(false);
    else setShowTodoEditor(false);
    return todoId;
  };

  const onOpenChange = () => {
    if (formControl) formControl.setOpen((val) => !val);
    else setShowTodoEditor((val) => !val);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {!formControl && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenChange}
          className="w-40 text-muted-foreground hover:text-primary"
        >
          {!showTodoEditor ? (
            <PlusCircle className="w-4 h-4 mr-1" />
          ) : (
            <ChevronUpCircle className="w-4 h-4 mr-1" />
          )}
          {!showTodoEditor ? "Add todo…" : "Hide todo editor"}
        </Button>
      )}

      {(formControl?.open || showTodoEditor) && (
        <TodoEditor onSave={saveItem} />
      )}
    </div>
  );
};

export default AddTodoSection;
