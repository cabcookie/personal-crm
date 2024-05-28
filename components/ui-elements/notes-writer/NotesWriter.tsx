import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

type GenericObject = { [key: string]: any };

const compareNotes = (obj1: GenericObject, obj2: GenericObject): boolean => {
  for (const key in obj1) {
    const val1 = obj1[key];
    if (!(key in obj2) && !!val1) return false;
    else {
      const val2 = obj2[key];
      if (
        typeof val1 === "object" &&
        val1 !== null &&
        typeof val2 === "object" &&
        val2 !== null
      ) {
        if (!compareNotes(val1, val2)) return false;
      } else {
        if (val1 !== val2) return false;
      }
    }
  }
  for (const key in obj2) if (!(key in obj1) && !!obj2[key]) return false;
  return true;
};

const isUpToDate = (
  notes: EditorJsonContent | string | undefined,
  editorJson: EditorJsonContent | undefined
) => {
  if (!notes) return false;
  if (!editorJson) return false;
  if (typeof notes === "string") return false;
  return compareNotes(notes, editorJson);
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
      Link,
    ],
    autofocus: autoFocus,
    editorProps: {
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
          class: cn(
            "prose w-full max-w-full text-notesEditor rounded-md -mx-2 p-2 bg-inherit transition duration-1000 ease",
            !isUpToDate(notes, editor.getJSON()) && "bg-destructive/10"
          ),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes]);

  return <EditorContent editor={editor} />;
};

export default NotesWriter;
