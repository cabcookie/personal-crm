import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import {
  applyPastePropsAndUiAttrs,
  applyReadOnly,
  updateEditorContent,
} from "../helpers/editor-effects";
import useExtensions from "./useExtensions";

type InboxEditorProps = {
  notes: JSONContent;
  saveNotes?: (editor: Editor) => void;
  autoFocus?: boolean;
  readonly?: boolean;
  showSaveStatus?: boolean;
};

const InboxEditor: FC<InboxEditorProps> = ({
  notes,
  saveNotes,
  autoFocus,
  readonly,
  showSaveStatus = true,
}) => {
  const extensions = useExtensions();
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

  /** Handle changes on activity.notes, editor's content, extensions, or readonly state */
  useEffect(() => {
    updateEditorContent(editor, notes);
  }, [editor, notes]);
  useEffect(() => {
    applyReadOnly(editor, readonly);
  }, [editor, readonly]);
  useEffect(() => {
    applyPastePropsAndUiAttrs(editor, notes, readonly, showSaveStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes, readonly]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default InboxEditor;
