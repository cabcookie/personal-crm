import { cn } from "@/lib/utils";
import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import EditorMenu from "../editors/EditorMenu";
import LinkBubbleMenu from "../editors/extensions/link-bubble-menu/LinkBubbleMenu";
import { handlePastingImage } from "../editors/extensions/s3-images/image-handling";
import { isUpToDate } from "../editors/helpers/compare";
import useExtensions from "./useExtensions";

type NotesWriterProps = {
  notes: JSONContent;
  saveNotes?: (editor: Editor) => void;
  autoFocus?: boolean;
  readonly?: boolean;
  showSaveStatus?: boolean;
  placeholder?: string;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  autoFocus,
  readonly,
  placeholder,
  showSaveStatus = true,
}) => {
  const extensions = useExtensions({ placeholder });
  const editor = useEditor({
    extensions,
    autofocus: autoFocus,
    editable: !readonly,
    content: notes,
    immediatelyRender: false,
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
        handlePaste: (view, event) => {
          if (!event.clipboardData) return false;
          const { items } = event.clipboardData;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              handlePastingImage(items[i], view, editor);
              return true;
            }
          }
          return false;
        },
        attributes: {
          class: cn(
            "prose w-full max-w-full text-notesEditor bg-inherit transition duration-1000 ease p-2",
            !readonly && "rounded-md border pt-16",
            showSaveStatus &&
              !readonly &&
              !isUpToDate(notes, editor.getJSON()) &&
              "bg-red-50"
          ),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes, extensions]);

  return (
    <>
      <div className="relative">
        <EditorContent editor={editor} />
        <EditorMenu
          className="absolute top-0 left-0"
          {...{ editor, readonly }}
        />
      </div>

      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesWriter;
