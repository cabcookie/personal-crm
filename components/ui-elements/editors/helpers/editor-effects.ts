import { cn } from "@/lib/utils";
import { Editor, JSONContent } from "@tiptap/react";
import { handlePastingImage } from "../extensions/s3-images/image-handling";
import { isUpToDate } from "./compare";

export const updateEditorContent = (
  editor: Editor | null,
  content: JSONContent | undefined
) => {
  if (!editor) return;
  if (!content) return;
  if (editor.getText() === "" && content) editor.commands.setContent(content);
};

export const applyReadOnly = (
  editor: Editor | null,
  readonly: boolean | undefined
) => {
  if (!editor) return;
  editor.setEditable(!readonly);
};

export const applyPastePropsAndUiAttrs = (
  editor: Editor | null,
  content: JSONContent | undefined,
  readonly: boolean | undefined,
  showSaveStatus: boolean | undefined = true
) => {
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
          showSaveStatus &&
            content &&
            !readonly &&
            !isUpToDate(content, editor.getJSON()) &&
            "bg-red-50"
        ),
      },
    },
  });
};