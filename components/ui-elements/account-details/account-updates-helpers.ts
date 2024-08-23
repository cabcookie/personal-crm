import { JSONContent } from "@tiptap/core";
import { debounce } from "lodash";

type UpdateFnProps = {
  id: string;
  name?: string;
  introduction?: JSONContent;
};

type UpdateAccountDetailsProps = UpdateFnProps & {
  serializeIntroduction?: () => { json: JSONContent };
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
