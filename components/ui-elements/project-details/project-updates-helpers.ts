import { debounce } from "lodash";

type UpdateFnProps = {
  id: string;
  project?: string;
  done?: boolean;
  dueOn?: Date;
  onHoldTill?: Date;
};

type UpdateProjectDetailsProps = UpdateFnProps & {
  updateProjectFn: (props: UpdateFnProps) => Promise<string | undefined>;
  setSaveStatus: (status: boolean) => void;
};

export const debouncedUpdateProjectDetails = debounce(
  async ({
    updateProjectFn,
    setSaveStatus,
    ...props
  }: UpdateProjectDetailsProps) => {
    const data = await updateProjectFn(props);
    if (data) setSaveStatus(true);
  },
  1500
);
