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
};

export const debouncedUpdateAccountDetails = debounce(
  async ({
    updateAccountFn,
    serializeIntroduction,
    ...props
  }: UpdateAccountDetailsProps) => {
    await updateAccountFn({
      ...props,
      introduction: serializeIntroduction?.().json,
    });
  },
  1500
);
