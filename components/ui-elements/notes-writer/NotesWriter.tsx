import React, { FC, ReactNode, useEffect, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import styles from "./NotesWriter.module.css";
import RecordDetails from "../record-details/record-details";
import { deserialize, renderElement, renderLeaf, serialize, withInlines } from "./notes-writer-helpers";

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
  const [editor] = useState(() => withInlines(withReact(withHistory(createEditor()))));

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
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </RecordDetails>
  );
};

export default NotesWriter;
