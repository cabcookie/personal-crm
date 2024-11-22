import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2, Save } from "lucide-react";
import { FC, useEffect, useState } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import useTodoEditorExtensions from "./useTodoEditorExtensions";

type TodoEditorProps = {
  onSave: (json: JSONContent) => Promise<string | undefined>;
};

const TodoEditor: FC<TodoEditorProps> = ({ onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const extensions = useTodoEditorExtensions();
  const editor = useEditor({
    extensions,
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: "prose w-full max-w-full px-2 bg-inherit border rounded-md",
        },
      },
    });
  }, [editor]);

  const saveItem = async (json: JSONContent) => {
    setIsSaving(true);
    const todoId = await onSave(json);
    if (!todoId) return;
    setIsSaving(false);
  };

  return (
    <>
      <h3 className="font-semibold">Describe the todo:</h3>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
      <Button
        disabled={isSaving}
        className={cn(isSaving && "text-muted-foreground")}
        onClick={() => editor && saveItem(editor.getJSON())}
        size="sm"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <Save className="w-4 h-4 mr-1" />
        )}
        Save Todo
      </Button>
    </>
  );
};

export default TodoEditor;
