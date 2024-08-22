import { MeetingTodo } from "@/api/useMeetingTodos";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import useExtensions from "./useExtensions";

const getTodoEditorContent = (
  meetingTodos: MeetingTodo[]
): EditorJsonContent => ({
  type: "doc",
  content: [
    {
      type: "taskList",
      content: meetingTodos.map(({ todo, todoId, blockId }) => ({
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
  meetingTodos: MeetingTodo[];
};

const TodoEditor: FC<TodoEditorProps> = ({ meetingTodos }) => {
  const extensions = useExtensions();
  const editor = useEditor({
    extensions,
    editable: false,
    immediatelyRender: false,
    content: getTodoEditorContent(meetingTodos),
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
