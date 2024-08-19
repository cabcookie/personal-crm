import { debounce } from "lodash";

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
