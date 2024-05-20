import { debounce } from "lodash";
import { EditorJsonContent } from "./notes-writer/NotesWriter";

type DebouncedUpdateNotesProps = {
  serializer: () => EditorJsonContent;
  setSaveStatus: (status: boolean) => void;
  updateNotes: (notes: EditorJsonContent) => Promise<string | undefined>;
  createActivity?: (notes: EditorJsonContent) => Promise<string | undefined>;
};

export const debouncedUpdateNotes = debounce(
  async ({
    serializer,
    setSaveStatus,
    updateNotes,
    createActivity,
  }: DebouncedUpdateNotesProps) => {
    const notes = serializer();
    if (createActivity) {
      const newActivity = await createActivity(notes);
      if (newActivity) setSaveStatus(true);
      return;
    }
    const data = await updateNotes(notes);
    if (data) setSaveStatus(true);
  },
  1000
);
