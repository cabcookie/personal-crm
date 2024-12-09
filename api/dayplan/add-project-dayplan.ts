import { type Schema } from "@/amplify/data/resource";
import { newDateTimeString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  dayPlanId: string;
  projectId: string;
  maybe: boolean;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

const getRecordId = async (projectId: string, dayPlanId: string) => {
  const { data, errors } = await client.models.DailyPlanProject.listByProjectId(
    { projectId },
    {
      filter: { dailyPlanId: { eq: dayPlanId } },
      selectionSet: ["id", "maybe"],
    }
  );
  if (errors) handleApiErrors(errors, "Error getting Project/Dayplan link");
  return data?.[0];
};

const createRecord = async (props: DataProps) => {
  const { data, errors } = await client.models.DailyPlanProject.create({
    projectId: props.projectId,
    dailyPlanId: props.dayPlanId,
    maybe: props.maybe,
    updatedAt: newDateTimeString(),
  });
  if (errors) handleApiErrors(errors, "Error creating Project/Dayplan link");
  return data;
};

const updateRecord = async (recordId: string, maybe: boolean) => {
  const { data, errors } = await client.models.DailyPlanProject.update({
    id: recordId,
    maybe,
    updatedAt: newDateTimeString(),
  });
  if (errors) handleApiErrors(errors, "Error updating Project/Dayplan link");
  return data;
};

export const addProjectDayplan = async ({ data: props, options }: Props) => {
  options?.mutate?.(false);
  const record = await getRecordId(props.projectId, props.dayPlanId);
  const data = !record
    ? await createRecord(props)
    : await updateRecord(record.id, props.maybe);
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
