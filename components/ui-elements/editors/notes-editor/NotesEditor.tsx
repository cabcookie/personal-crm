import useActivity from "@/api/useActivity";
import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
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
  const [lastActivity, setLastActivity] = useState(activity);
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

  /** The editor is an external mutable store, so its content is subscribed to
   * rather than mirrored into state from an effect. isUpToDate is the same
   * comparison the effect used to decide whether the content really changed. */
  const editorContent = useEditorState({
    editor,
    selector: ({ editor }) => editor?.getJSON(),
    equalityFn: (a, b) =>
      (!a && !b) || (!!a && !!isUpToDate(a, b ?? undefined)),
  });

  if (lastActivity !== activity) {
    setLastActivity(activity);
    if (activity) setActivityNotes(activity.notes);
  }
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
