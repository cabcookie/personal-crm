import { Editor, JSONContent } from "@tiptap/core";
import { debounce } from "lodash";

type UpdateFnProps = {
  id: string;
  name?: string;
  introduction?: JSONContent;
};

type UpdateAccountDetailsProps = UpdateFnProps & {
  editor?: Editor;
  updateAccountFn: (props: UpdateFnProps) => Promise<string | undefined>;
  updateSavedState?: (state: boolean) => void;
};

export const debouncedUpdateAccountDetails = debounce(
  async ({
    updateAccountFn,
    editor,
    updateSavedState,
    ...props
  }: UpdateAccountDetailsProps) => {
    await updateAccountFn({
      ...props,
      introduction: editor?.getJSON(),
    });
    updateSavedState?.(true);
  },
  1500
);
