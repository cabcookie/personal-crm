import { debounce } from "lodash";

type UpdateActionsProps = {
  serializer: () => string;
  setSaveStatus: (status: boolean) => void;
  updateActions: (actions: string) => Promise<string | undefined>;
};

export const debouncedUpdateActions = debounce(
  async ({
    serializer,
    setSaveStatus,
    updateActions,
  }: UpdateActionsProps) => {
    const actions = serializer();
    const data = await updateActions(actions);
    if (data) setSaveStatus(true);
  },
  1000
);

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
