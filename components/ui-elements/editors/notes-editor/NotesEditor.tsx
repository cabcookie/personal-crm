import useActivity from "@/api/useActivity";
import { logFp } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { flow } from "lodash/fp";
import { FC, useEffect } from "react";
import LinkBubbleMenu from "../extensions/link-bubble-menu/LinkBubbleMenu";
import { handlePastingImage } from "../extensions/s3-images/image-handling";
import { documentIsUpToDate } from "../helpers/compare";
import { emptyDocument, getBlockIds } from "../helpers/document";
import useExtensions from "./useExtensions";

type NotesEditorProps = {
  activityId: string;
  readonly?: boolean;
};

const NotesEditor: FC<NotesEditorProps> = ({ activityId, readonly }) => {
  const { activity, updateNotes } = useActivity(activityId);
  // const { mutateOpenTasks } = useOpenTasksContext();
  const extensions = useExtensions();

  const handleNotesUpdate = (editor: Editor) => {
    if (!updateNotes) return;
    // debouncedUpdateNotes({
    //   serializer: getEditorContentAndTaskData(editor, (tasks) =>
    //     mutateOpenTasks(tasks, activity)
    //   ),
    //   updateNotes,
    // });

    flow(getBlockIds, logFp("handleNotesUpdate", "blockIds"))(editor.getJSON());
  };

  const editor = useEditor({
    extensions,
    editable: !readonly,
    content: activity?.notes ?? emptyDocument,
    onUpdate: ({ editor }) => {
      handleNotesUpdate(editor);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getText() === "" && activity?.notes)
      editor.commands.setContent(activity?.notes);
  }, [editor, activity?.notes]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  useEffect(() => {
    if (!editor) return;
    console.log("Update extensions...");
    editor.setOptions({ extensions });
  }, [editor, extensions]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
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
            "prose w-full max-w-full text-notesEditor rounded-md p-2 bg-inherit transition duration-1000 ease",
            activity?.notes &&
              !readonly &&
              !documentIsUpToDate(activity.notes, editor.getJSON()) &&
              "bg-red-50"
          ),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), activity?.notes]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor && <LinkBubbleMenu editor={editor} />}
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesEditor;
