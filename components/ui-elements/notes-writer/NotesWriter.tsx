import React, { FC, ReactNode, useEffect, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import {
  TransformNotesToMdFunction,
  renderElement,
  transformMdToNotes,
  transformNotesToMd,
} from "./notes-writer-helpers";
import styles from "./NotesWriter.module.css";
import RecordDetails from "../record-details/record-details";

type NotesWriterProps = {
  notes: string;
  saveNotes?: (
    notes: Descendant[],
    transformerFn: TransformNotesToMdFunction
  ) => void;
  unsaved?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  title?: ReactNode;
};

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
    editor.children = transformMdToNotes(notes);
    editor.onChange();
  }, [notes, editor]);

  const handleEditNote = (val: Descendant[]) => {
    if (!saveNotes) return;
    const isAstChange = editor.operations.some(
      (op) => "set_selection" !== op.type
    );
    if (!isAstChange) return;
    saveNotes(val, transformNotesToMd);
  };

  return (
    <RecordDetails title={title} className={styles.fullWidth}>
      <Slate
        editor={editor}
        initialValue={transformMdToNotes(notes)}
        onChange={handleEditNote}
      >
        <Editable
          className={`${styles.editorInput} ${unsaved && styles.unsaved}`}
          renderElement={renderElement}
          autoFocus={autoFocus}
          placeholder={placeholder || "Start taking notes..."}
        />
      </Slate>
    </RecordDetails>
  );
};

export default NotesWriter;
