import { debounce } from "lodash";
import {
  EditorJsonContent,
  SerializerOutput,
} from "../ui-elements/notes-writer/NotesWriter";

type DebouncedUpdateNotesProps = {
  serializer: () => SerializerOutput;
  updateNotes: (notes: EditorJsonContent) => Promise<string | undefined>;
};

export const debouncedUpdateNotes = debounce(
  async ({ serializer, updateNotes }: DebouncedUpdateNotesProps) => {
    const { json: notes } = serializer();
    await updateNotes(notes);
  },
  1000
);

type DebounceUpdateDateProps = {
  updateDate: () => Promise<string | undefined>;
  setSaveStatus: (saved: boolean) => void;
};

export const debounedUpdateDate = debounce(
  async ({ updateDate, setSaveStatus }: DebounceUpdateDateProps) => {
    const result = await updateDate();
    if (!result) return;
    setSaveStatus(true);
  },
  2000
);
