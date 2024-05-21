import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FC, useEffect, useState } from "react";
import styles from "./NotesWriter.module.css";

export type EditorJsonContent = JSONContent;
export type SerializerOutput = {
  json: EditorJsonContent;
};

type TransformNotesVersionType = {
  version?: number | null;
  notes?: string | null;
  notesJson?: any;
};

export const transformNotesVersion = ({
  version,
  notes,
  notesJson,
}: TransformNotesVersionType) =>
  version === 2 ? (notesJson ? JSON.parse(notesJson) : "") : notes || undefined;

type NotesWriterProps = {
  notes?: EditorJsonContent | string;
  saveNotes?: (serializer: () => SerializerOutput) => void;
  unsaved?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  submitOnEnter?: boolean;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  unsaved,
  autoFocus,
  placeholder = "Start taking notes...",
  // submitOnEnter,
}) => {
  const [isSaved, setIsSaved] = useState(!unsaved);
  const [initialNotes, setInitialNotes] = useState(notes);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        emptyEditorClass: styles.emptyEditor,
        placeholder,
      }),
      Highlight,
      Link.configure({
        HTMLAttributes: {
          class: styles.link,
        },
      }),
    ],
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: `${styles.editor} ${isSaved ? "" : styles.unsaved}`,
      },
    },
    content: notes,
    onUpdate: ({ editor }) => {
      if (!saveNotes) return;
      saveNotes(() => ({ json: editor.getJSON() }));
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (unsaved !== isSaved) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `${styles.editor} ${unsaved ? styles.unsaved : ""}`,
        },
      },
    });
    setIsSaved(!unsaved);
  }, [editor, unsaved, isSaved]);

  useEffect(() => {
    if (!editor) return;
    if (initialNotes === notes) return;
    const { from, to } = editor.state.selection;
    editor.commands.setContent(notes || "");
    editor.commands.setTextSelection({ from, to });
    setInitialNotes(notes);
  }, [editor, notes, initialNotes]);

  return (
    <div className={styles.wrapper}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesWriter;
