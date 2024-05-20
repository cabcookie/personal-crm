import React, { FC, ReactNode } from "react";
import styles from "./NotesWriter.module.css";
import RecordDetails from "../record-details/record-details";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/core";

export type EditorJsonContent = JSONContent;

type TransformNotesVersionType = {
  version?: number | null;
  notes?: string | null;
  notesJson?: any;
};

export const initialNotesJson: EditorJsonContent = {
  type: "doc",
  content: [],
};

export const transformNotesVersion = ({
  version = 1,
  notes,
  notesJson,
}: TransformNotesVersionType) =>
  version === 2
    ? !!notesJson && typeof notesJson === "object"
      ? notesJson
      : initialNotesJson
    : textToEditorJson(notes || "");

const textToEditorJson = (notes: string): object => ({
  type: "doc",
  content:
    notes?.split("\n").map((line) => ({
      type: "paragraph",
      text: line,
    })) || [],
});

type NotesWriterProps = {
  notes: object;
  saveNotes?: (serializer: () => { json: object }) => void;
  unsaved?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  title?: ReactNode;
  submitOnEnter?: boolean;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  unsaved,
  autoFocus,
  placeholder,
  title = "Notes",
  submitOnEnter,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: notes,
    onUpdate: ({ editor }) => {
      if (!saveNotes) return;
      saveNotes(() => ({ json: editor.getJSON() }));
    },
  });

  return (
    <RecordDetails
      title={title === "" ? undefined : title}
      className={styles.fullWidth}
    >
      <EditorContent editor={editor} />
      <div>{JSON.stringify(editor?.getJSON())}</div>
    </RecordDetails>
  );
};

export default NotesWriter;
