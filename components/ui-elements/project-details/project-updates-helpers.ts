import { Descendant } from "slate";
import { TransformNotesToMdFunction } from "../notes-writer/notes-writer-helpers";
import { debounce } from "lodash";

type UpdateActionsProps = {
  notes: Descendant[];
  transformerFn: TransformNotesToMdFunction;
  setSaveStatus: (status: boolean) => void;
  updateActions: (actions: string) => Promise<string | undefined>;
};

export const debouncedUpdateActions = debounce(
  async ({
    notes,
    transformerFn,
    setSaveStatus,
    updateActions,
  }: UpdateActionsProps) => {
    const actions = transformerFn(notes);
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
