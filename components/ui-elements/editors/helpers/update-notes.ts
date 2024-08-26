import { Editor } from "@tiptap/core";
import { debounce } from "lodash";

export type UpdateNotesFunction = (editor: Editor | undefined) => void;

export const debouncedUpdateNote = debounce(
  (updateFn: UpdateNotesFunction, editor: Editor | undefined) => {
    updateFn(editor);
  },
  1500
);
