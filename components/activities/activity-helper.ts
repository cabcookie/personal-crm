import { SerializerOutput } from "@/helpers/ui-notes-writer";
import { debounce } from "lodash";

type DebouncedUpdateNotesProps = {
  serializer: () => SerializerOutput;
  updateNotes: (
    serializedOutput: SerializerOutput
  ) => Promise<string | undefined>;
};

export const debouncedUpdateNotes = debounce(
  async ({ serializer, updateNotes }: DebouncedUpdateNotesProps) => {
    const serializedOutput = serializer();
    await updateNotes(serializedOutput);
  },
  1500
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
