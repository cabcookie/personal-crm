import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import {
  applyPastePropsAndUiAttrs,
  applyReadOnly,
  updateEditorContent,
} from "../helpers/editor-effects";
import MetaData from "../meta-data";
import { isCmdEnter } from "./helpers";
import useExtensions from "./useExtensions";

type InboxEditorProps = {
  notes: JSONContent;
  createdAt?: Date;
  updatedAt?: Date;
  saveNotes?: (editor: Editor) => void;
  saveAtCmdEnter?: (editor: Editor) => void;
  autoFocus?: boolean;
  readonly?: boolean;
  showSaveStatus?: boolean;
  placeholder?: string;
  className?: string;
};

const InboxEditor: FC<InboxEditorProps> = ({
  notes,
  saveNotes,
  saveAtCmdEnter,
  autoFocus,
  readonly,
  createdAt,
  updatedAt,
  className,
  showSaveStatus = true,
  placeholder = "What's on your mind?",
}) => {
  const extensions = useExtensions(placeholder);
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
    editorProps: {
      ...(!saveAtCmdEnter
        ? {}
        : {
            handleKeyDown: (_view, event) => {
              if (!editor) return false;
              if (!isCmdEnter(event)) return false;
              saveAtCmdEnter(editor);
              return true;
            },
          }),
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
    applyPastePropsAndUiAttrs(
      editor,
      notes,
      readonly,
      showSaveStatus,
      undefined,
      className
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes, readonly]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
      {createdAt && <MetaData created={createdAt} updated={updatedAt} />}
    </>
  );
};

export default InboxEditor;
