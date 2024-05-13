import React, { FC, ReactNode, useEffect, useState } from "react";
import { createEditor, Descendant, Node } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import styles from "./NotesWriter.module.css";
import RecordDetails from "../record-details/record-details";

type NotesWriterProps = {
  notes: string;
  saveNotes?: (serializer: () => string) => void;
  unsaved?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  title?: ReactNode;
};

const serialize = (descendants: Descendant[]) => () => descendants.map((d) => Node.string(d)).join("\n"); 

const deserialize = (notes: string) => notes.split("\n").map((line) => ({ children: [{ text: line }]}));

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  unsaved,
  autoFocus,
  placeholder,
  title = "Notes",
}) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  useEffect(() => {
    editor.children = deserialize(notes);
    editor.onChange();
  }, [notes, editor]);

  const handleEditNote = (val: Descendant[]) => {
    if (!saveNotes) return;
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (!isAstChange) return;
    saveNotes(serialize(val));
  };

  return (
    <RecordDetails title={title === "" ? undefined : title} className={styles.fullWidth}>
      <Slate
        editor={editor}
        initialValue={deserialize(notes)}
        onChange={handleEditNote}
      >
        <Editable
          className={`${styles.editorInput} ${unsaved && styles.unsaved}`}
          autoFocus={autoFocus}
          placeholder={placeholder || "Start taking notes..."}
        />
      </Slate>
    </RecordDetails>
  );
};

export default NotesWriter;
