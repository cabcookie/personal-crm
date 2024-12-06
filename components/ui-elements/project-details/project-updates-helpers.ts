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
