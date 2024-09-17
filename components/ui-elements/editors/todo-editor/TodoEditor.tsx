import { Todo } from "@/api/useProjectTodos";
import { getTodoEditorContent } from "@/helpers/todos";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import useExtensions from "./useExtensions";

type TodoEditorProps = {
  todos: Todo[];
};

const TodoEditor: FC<TodoEditorProps> = ({ todos }) => {
  const extensions = useExtensions();
  const editor = useEditor({
    extensions,
    editable: false,
    immediatelyRender: false,
    content: getTodoEditorContent(todos),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: "prose w-full max-w-full pt-1 bg-inherit",
        },
      },
    });
  }, [editor]);

  return <EditorContent editor={editor} />;
};

export default TodoEditor;
