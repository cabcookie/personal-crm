import { debounce } from "lodash";

type UpdateFnProps = {
  id: string;
  name?: string;
};

type UpdateAccountDetailsProps = UpdateFnProps & {
  updateAccountFn: (props: UpdateFnProps) => Promise<string | undefined>;
  setSaveStatus: (status: boolean) => void;
};

export const debouncedUpdateAccountDetails = debounce(
  async ({
    updateAccountFn,
    setSaveStatus,
    ...props
  }: UpdateAccountDetailsProps) => {
    const data = await updateAccountFn(props);
    if (data) setSaveStatus(true);
  },
  1500
);
