import React, { FC, ReactNode, useEffect, useState } from "react";
import styles from "./NotesWriter.module.css";
import RecordDetails from "../record-details/record-details";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type NotesWriterProps = {
  notes: string;
  saveNotes?: (serializer: () => string) => void;
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
    content: "<p>Hello World</p>",
  });
  const [json, setJson] = useState({});

  useEffect(() => {
    // todo: load existing content
  }, [notes, editor]);

  /**
  const handleEditNote = (val: Descendant[]) => {
    if (!saveNotes) return;
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (!isAstChange) return;
    saveNotes(serialize(val));
  };
  */

  const handleOnChange = () => {
    if (!saveNotes) return;
    if (!editor) return;
    setJson(editor.getJSON());
    saveNotes(() => {
      const json = editor.getJSON();
      return JSON.stringify(json)}
    );
  };

  return (
    <RecordDetails title={title === "" ? undefined : title} className={styles.fullWidth}>
      <EditorContent editor={editor} onChange={handleOnChange} />
      <div>{JSON.stringify(editor?.getJSON())}</div>
    </RecordDetails>
  );
};

export default NotesWriter;
