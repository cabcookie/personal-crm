import { debounce } from "lodash";
import {
  EditorJsonContent,
  SerializerOutput,
} from "../notes-writer/NotesWriter";

type UpdateFnProps = {
  id: string;
  name?: string;
  introduction?: EditorJsonContent;
};

type UpdateAccountDetailsProps = UpdateFnProps & {
  serializeIntroduction?: () => SerializerOutput;
  updateAccountFn: (props: UpdateFnProps) => Promise<string | undefined>;
  setSaveStatus: (status: boolean) => void;
};

export const debouncedUpdateAccountDetails = debounce(
  async ({
    updateAccountFn,
    setSaveStatus,
    serializeIntroduction,
    ...props
  }: UpdateAccountDetailsProps) => {
    const data = await updateAccountFn({
      ...props,
      introduction: serializeIntroduction?.().json,
    });
    if (data) setSaveStatus(true);
  },
  1500
);
