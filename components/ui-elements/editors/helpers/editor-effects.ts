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
  showSaveStatus: boolean | undefined = true,
  allowPastingImages: boolean | undefined = true,
  className: string | undefined = undefined
) => {
  if (!editor) return;
  editor.setOptions({
    editorProps: {
      ...(!allowPastingImages
        ? {}
        : {
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
          }),
      attributes: {
        class: cn(
          "prose w-full max-w-full text-notesEditor bg-inherit transition duration-1000 ease",
          !readonly && "rounded-md border p-2 pt-16",
          showSaveStatus &&
            content &&
            !readonly &&
            !isUpToDate(content, editor.getJSON()) &&
            "bg-red-50",
          className
        ),
      },
    },
  });
};
