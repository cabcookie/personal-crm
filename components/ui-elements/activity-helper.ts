import { debounce } from "lodash";

type DebouncedUpdateNotesProps = {
  serializer: () => string;
  setSaveStatus: (status: boolean) => void;
  updateNotes: (notes: string) => Promise<string | undefined>;
  createActivity?: (notes: string) => Promise<string | undefined>;
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
