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
  updateSavedState?: (state: boolean) => void;
};

export const debouncedUpdateAccountDetails = debounce(
  async ({
    updateAccountFn,
    serializeIntroduction,
    updateSavedState,
    ...props
  }: UpdateAccountDetailsProps) => {
    await updateAccountFn({
      ...props,
      introduction: serializeIntroduction?.().json,
    });
    updateSavedState && updateSavedState(true);
  },
  1500
);
