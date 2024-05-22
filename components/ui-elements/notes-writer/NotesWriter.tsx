import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { isEqual } from "lodash";
import { FC, useEffect } from "react";
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
  autoFocus?: boolean;
  placeholder?: string;
  onSubmit?: (item: EditorJsonContent) => void;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  autoFocus,
  placeholder = "Start taking notes...",
  onSubmit,
}) => {
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
        class: styles.editor,
      },
      handleKeyDown: (view, event) => {
        if (!onSubmit) return false;
        if (event.metaKey && event.key === "Enter") {
          event.preventDefault();
          onSubmit(view.state.doc.toJSON());
          return true;
        }
        return false;
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
    if (editor.getText() === "" && notes) editor.commands.setContent(notes);
  }, [editor, notes]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `${styles.editor} ${
            isEqual(notes, editor.getJSON()) ? "" : styles.unsaved
          }`,
        },
      },
    });
  }, [editor?.getJSON(), notes]);

  return (
    <div className={styles.wrapper}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesWriter;
