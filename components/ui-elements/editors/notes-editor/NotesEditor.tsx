import useActivity from "@/api/useActivity";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import { emptyDocument } from "../helpers/document";
import {
  applyExtensions,
  applyPastePropsAndUiAttrs,
  applyReadOnly,
  updateEditorContent,
} from "../helpers/editor-effects";
import { debouncedUpdateNote } from "../helpers/update-notes";
import useExtensions from "./useExtensions";

type NotesEditorProps = {
  activityId: string;
  readonly?: boolean;
};

const NotesEditor: FC<NotesEditorProps> = ({ activityId, readonly }) => {
  const { activity, updateNotes } = useActivity(activityId);
  const extensions = useExtensions();

  const handleNotesUpdate = (editor: Editor) => {
    debouncedUpdateNote(updateNotes, editor);
  };

  const editor = useEditor({
    extensions,
    editable: !readonly,
    content: activity?.notes ?? emptyDocument,
    onUpdate: ({ editor }) => {
      handleNotesUpdate(editor);
    },
  });

  /** Handle changes on activity.notes, editor's content, extensions, or readonly state */
  useEffect(() => {
    updateEditorContent(editor, activity?.notes);
  }, [editor, activity?.notes]);
  useEffect(() => {
    applyReadOnly(editor, readonly);
  }, [editor, readonly]);
  useEffect(() => {
    applyExtensions(editor, extensions);
  }, [editor, extensions]);
  useEffect(() => {
    applyPastePropsAndUiAttrs(editor, activity?.notes, readonly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity?.notes, editor?.getJSON(), readonly]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesEditor;
