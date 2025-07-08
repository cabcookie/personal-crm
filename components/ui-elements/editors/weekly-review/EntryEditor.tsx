import { FC, useEffect, useState } from "react";
import { useExtentions } from "./useExtensions";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useWeeklyReview } from "@/api/useWeeklyReview";
import { debounce } from "lodash";

interface EntryEditorProps {
  entryId: string;
  content: string;
}

export const EntryEditor: FC<EntryEditorProps> = ({ content, entryId }) => {
  const [editorContent, setEditorContent] = useState<string>();
  const extensions = useExtentions();
  const { updateWeeklyReviewEntryContent: updateFn } = useWeeklyReview();

  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }) => {
      debouncedContentUpdate(entryId, updateFn, editor);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (!editorContent) return setEditorContent(editor.getText());
    if (editorContent === editor.getText()) return;
    setEditorContent(editor.getText());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getText()]);
  useEffect(() => {
    if (!editor) return;
    if (editor.getText() === "") editor.commands.setContent(content);
  }, [editor, content]);
  useEffect(() => {
    applyUiAttrs(editor, content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editorContent]);

  return <EditorContent {...{ editor }} />;
};

const applyUiAttrs = (editor: Editor | null, content: string) => {
  if (!editor) return;
  editor.setOptions({
    editorProps: {
      attributes: {
        class: cn(
          "prose w-full max-w-full text-notesEditor bg-inherit transition duration-500 ease rounded-md border p-2",
          editor.getText() !== content && "bg-red-50"
        ),
      },
    },
  });
};

const debouncedContentUpdate = debounce(
  (
    entryId: string,
    updateFn: ReturnType<
      typeof useWeeklyReview
    >["updateWeeklyReviewEntryContent"],
    editor: Editor | undefined
  ) => {
    if (!editor) return;
    updateFn(entryId, editor?.getText());
  },
  1000
);
