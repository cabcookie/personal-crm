import { Todo } from "@/api/useProjectTodos";
import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import useExtensions from "./useExtensions";

const getTodoEditorContent = (todos: Todo[]): JSONContent => ({
  type: "doc",
  content: [
    {
      type: "taskList",
      content: todos.map(({ todo, todoId, blockId }) => ({
        ...todo,
        attrs: {
          ...todo.attrs,
          blockId,
          todoId,
        },
      })),
    },
  ],
});

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

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default TodoEditor;
