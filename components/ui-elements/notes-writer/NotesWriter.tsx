import { cn } from "@/lib/utils";
import { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorView } from "@tiptap/pm/view";
import { EditorContent, generateText, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getUrl, uploadData } from "aws-amplify/storage";
import { FC, useEffect } from "react";
import styles from "./NotesWriter.module.css";
import S3ImageExtension from "./S3ImageExtension";

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

const MyExtensions = [StarterKit, Highlight, Link, Typography];

export const getTextFromEditorJsonContent = (
  json?: EditorJsonContent | string
) =>
  !json
    ? ""
    : typeof json === "string"
    ? json
    : generateText(
        { ...json, content: json.content?.filter((c) => c.type !== "s3image") },
        MyExtensions
      );

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
  readonly?: boolean;
  showSaveStatus?: boolean;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  autoFocus,
  placeholder = "Start taking notes...",
  onSubmit,
  readonly,
  showSaveStatus = true,
}) => {
  const editor = useEditor({
    extensions: [
      ...MyExtensions,
      S3ImageExtension,
      Placeholder.configure({
        emptyEditorClass: styles.emptyEditor,
        placeholder,
      }),
    ],
    autofocus: autoFocus,
    editable: !readonly,
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
      handlePaste: (view, event) => {
        if (!event.clipboardData) return false;
        const { items } = event.clipboardData;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            handlePastingImage(items[i], view);
            return true;
          }
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

  const dispatchImage = (view: EditorView, url: string, fileName: string) => {
    const { schema } = view.state;
    const { tr } = view.state;
    const pos = view.state.selection.from;
    tr.insert(pos, schema.nodes.hardBreak.create());
    tr.insert(pos + 1, schema.nodes.paragraph.create());
    tr.insert(
      pos + 2,
      schema.nodes.s3image.create({
        src: url,
        fileKey: fileName,
      })
    );
    view.dispatch(tr);
  };

  const updateImageSrc = (
    view: EditorView,
    url: string,
    s3Key: string,
    expiresAt: string,
    fileName: string
  ) => {
    const { state, dispatch } = view;
    const { tr, doc } = state;
    let pos: number | null = null;

    doc.descendants((node, nodePos) => {
      if (node.type.name === "s3image" && node.attrs.fileKey === fileName) {
        pos = nodePos;
        return false;
      }
      return true;
    });

    if (pos !== null) {
      const transaction = tr.setNodeMarkup(pos, undefined, {
        src: url,
        s3Key,
        expiresAt,
        fileKey: fileName,
      });
      dispatch(transaction);
    }
  };

  const handlePastingImage = async (
    item: DataTransferItem,
    view: EditorView
  ) => {
    const file = item.getAsFile();
    if (!file) return false;
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    dispatchImage(view, URL.createObjectURL(file), fileName);

    const { path: s3Path } = await uploadData({
      path: ({ identityId }) => `user-files/${identityId}/${fileName}`,
      data: file,
      options: {
        contentType: file.type,
      },
    }).result;

    const { url, expiresAt } = await getUrl({ path: s3Path });
    updateImageSrc(
      view,
      url.toString(),
      s3Path,
      expiresAt.toISOString(),
      fileName
    );
    return true;
  };

  useEffect(() => {
    if (!editor) return;
    if (editor.getText() === "" && notes) editor.commands.setContent(notes);
  }, [editor, notes]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: cn(
            "prose w-full max-w-full text-notesEditor rounded-md p-2 bg-inherit transition duration-1000 ease",
            showSaveStatus &&
              !readonly &&
              !isUpToDate(notes, editor.getJSON()) &&
              "bg-destructive/10"
          ),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes]);

  useEffect(() => {
    if (editor?.isActive && autoFocus && !editor?.isFocused)
      editor.commands.focus();
  }, [editor?.commands, editor?.isActive, editor?.isFocused, autoFocus]);

  return <EditorContent editor={editor} />;
};

export default NotesWriter;
