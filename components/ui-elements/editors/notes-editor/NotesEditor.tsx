import useActivity from "@/api/useActivity";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect, useState } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import { isUpToDate } from "../helpers/compare";
import { emptyDocument } from "../helpers/document";
import {
  applyPastePropsAndUiAttrs,
  applyReadOnly,
  updateEditorContent,
} from "../helpers/editor-effects";
import { debouncedUpdateNote } from "../helpers/update-notes";
import useExtensions, { EditorJsonContent } from "./useExtensions";

type NotesEditorProps = {
  activityId: string;
  readonly?: boolean;
};

const NotesEditor: FC<NotesEditorProps> = ({ activityId, readonly }) => {
  const { activity, updateNotes } = useActivity(activityId);
  const [activityNotes, setActivityNotes] = useState<
    EditorJsonContent | undefined
  >();
  const [editorContent, setEditorContent] = useState<
    EditorJsonContent | undefined
  >();
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
    if (!editor) return;
    if (isUpToDate(editor.getJSON(), activity?.notes)) return;
    setEditorContent(editor.getJSON());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
  useEffect(() => {
    if (!activity) return;
    setActivityNotes(activity.notes);
  }, [activity]);
  useEffect(() => {
    updateEditorContent(editor, activityNotes);
  }, [editor, activityNotes]);
  useEffect(() => {
    applyReadOnly(editor, readonly);
  }, [editor, readonly]);
  useEffect(() => {
    applyPastePropsAndUiAttrs(editor, activityNotes, readonly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityNotes, editorContent, readonly]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesEditor;
