import { Todo } from "@/api/useProjectTodos";
import { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import useExtensions from "./useExtensions";

const getParagraphWithLinkToActivity = (activityId: string): JSONContent => ({
  type: "paragraph",
  content: [
    {
      type: "text",
      marks: [
        { type: "italic" },
        {
          type: "link",
          attrs: {
            rel: "noopener noreferrer nofollow",
            href: `/activities/${activityId}`,
          },
        },
      ],
      text: "Details",
    },
  ],
});

const getTodoEditorContent = (todos: Todo[]): JSONContent => ({
  type: "doc",
  content: [
    {
      type: "taskList",
      content: todos.map(({ todo, todoId, blockId, activityId }) => ({
        ...todo,
        content: [
          ...(todo.content ?? []),
          getParagraphWithLinkToActivity(activityId),
        ],
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

  return <EditorContent editor={editor} />;
};

export default TodoEditor;
