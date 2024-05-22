import { debounce } from "lodash";
import {
  EditorJsonContent,
  SerializerOutput,
} from "./notes-writer/NotesWriter";

type DebouncedUpdateNotesProps = {
  serializer: () => SerializerOutput;
  updateNotes: (notes: EditorJsonContent) => Promise<string | undefined>;
  createActivity?: (notes: EditorJsonContent) => Promise<string | undefined>;
};

export const debouncedUpdateNotes = debounce(
  async ({
    serializer,
    updateNotes,
    createActivity,
  }: DebouncedUpdateNotesProps) => {
    const { json: notes } = serializer();
    if (createActivity) return await createActivity(notes);
    await updateNotes(notes);
  },
  1000
);
