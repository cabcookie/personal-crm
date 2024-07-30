import { EditorJsonContent, isUpToDate } from "@/helpers/ui-notes-writer";
import { handlePastingImage } from "@/helpers/ui-notes-writer/image-handling";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "./link-bubble-menu/LinkBubbleMenu";
import useExtensions from "./useExtensions";

type NotesWriterProps = {
  notes: EditorJsonContent;
  saveNotes?: (editor: Editor) => void;
  autoFocus?: boolean;
  readonly?: boolean;
  showSaveStatus?: boolean;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  autoFocus,
  readonly,
  showSaveStatus = true,
}) => {
  const extensions = useExtensions({});
  const editor = useEditor({
    extensions,
    autofocus: autoFocus,
    editable: !readonly,
    editorProps: {
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
      saveNotes(editor);
    },
  });

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
      extensions,
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
  }, [editor?.getJSON(), notes, extensions]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesWriter;
