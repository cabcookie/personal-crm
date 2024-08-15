import { Editor } from "@tiptap/core";
import { debounce } from "lodash";
import { EditorJsonContent } from "../notes-editor/useExtensions";

type BlockToBeCreated = {
  tempId: string;
  blockId?: string;
  content: EditorJsonContent;
};

export type BlockIdMapping =
  | {
      blockId: string;
      content?: never;
      tempId?: never;
    }
  | BlockToBeCreated;

export type CreateBlockFunction = (
  block: BlockToBeCreated
) => Promise<BlockToBeCreated>;

export type UpdateNotesFunction = (editor: Editor | undefined) => void;

export const debouncedUpdateNote = debounce(
  (updateFn: UpdateNotesFunction, editor: Editor | undefined) => {
    updateFn(editor);
  },
  1500
);
