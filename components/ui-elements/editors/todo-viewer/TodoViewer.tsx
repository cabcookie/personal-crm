import { Todo } from "@/api/useProjectTodos";
import { getTodoViewerContent } from "@/helpers/todos";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import useExtensions from "./useExtensions";

type TodoViewerProps = {
  todos: Todo[];
};

const TodoViewer: FC<TodoViewerProps> = ({ todos }) => {
  const extensions = useExtensions();
  const editor = useEditor({
    extensions,
    editable: false,
    immediatelyRender: false,
    content: getTodoViewerContent(todos),
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

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(getTodoViewerContent(todos));
  }, [todos, editor]);

  return <EditorContent editor={editor} />;
};

export default TodoViewer;
