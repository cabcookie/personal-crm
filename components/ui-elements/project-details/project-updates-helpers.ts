import { debounce } from "lodash";
import {
  EditorJsonContent,
  SerializerOutput,
} from "../notes-writer/NotesWriter";

type UpdateActionsProps = {
  serializer: () => SerializerOutput;
  updateActions: (actions: EditorJsonContent) => Promise<string | undefined>;
};

export const debouncedUpdateActions = debounce(
  async ({ serializer, updateActions }: UpdateActionsProps) => {
    const { json: actions } = serializer();
    await updateActions(actions);
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
