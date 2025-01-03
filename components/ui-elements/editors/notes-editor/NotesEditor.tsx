import useActivity from "@/api/useActivity";
import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect, useState } from "react";
import EditorMenu from "../EditorMenu";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import { isUpToDate } from "../helpers/compare";
import { emptyDocument } from "../helpers/document";
import {
  applyPastePropsAndUiAttrs,
  applyReadOnly,
  updateEditorContent,
} from "../helpers/editor-effects";
import { debouncedUpdateNote } from "../helpers/update-notes";
import MetaData from "../meta-data";
import useExtensions from "./useExtensions";

type NotesEditorProps = {
  activityId: string;
  readonly?: boolean;
};

const NotesEditor: FC<NotesEditorProps> = ({ activityId, readonly }) => {
  const { activity, updateNotes } = useActivity(activityId);
  const [activityNotes, setActivityNotes] = useState<JSONContent | undefined>();
  const [editorContent, setEditorContent] = useState<JSONContent | undefined>();
  const extensions = useExtensions();

  const handleNotesUpdate = (editor: Editor) => {
    debouncedUpdateNote(updateNotes, editor);
  };

  const editor = useEditor({
    extensions,
    editable: !readonly,
    immediatelyRender: false,
    content: activity?.notes ?? emptyDocument,
    onUpdate: ({ editor }) => {
      handleNotesUpdate(editor);
    },
  });

  /** Handle changes on activity.notes, editor's content, extensions, or readonly state */
  useEffect(() => {
    if (!editor) return;
    if (!editorContent) return setEditorContent(editor.getJSON());
    if (isUpToDate(editorContent, editor.getJSON())) return;
    setEditorContent(editor.getJSON());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON()]);
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
      <div className="relative">
        <EditorContent editor={editor} />
        <EditorMenu
          className="absolute top-0 left-0"
          {...{ editor, readonly }}
        />
      </div>
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
      <MetaData
        created={activity?.finishedOn}
        updated={activity?.updatedAt}
        readonly={readonly}
      />
    </>
  );
};

export default NotesEditor;
