import { type Schema } from "@/amplify/data/resource";
import { newDateTimeString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/data";
import { CrudOptions, handleApiErrors } from "../globals";
const client = generateClient<Schema>();

interface DataProps {
  dayPlanId: string;
  todoId: string;
  postponed: boolean;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

const getRecordId = async (dayPlanId: string, todoId: string) => {
  const { data, errors } = await client.models.DailyPlanTodo.listByTodoId(
    { todoId },
    {
      filter: { dailyPlanId: { eq: dayPlanId } },
      selectionSet: ["id"],
    }
  );
  if (errors) handleApiErrors(errors, "Error getting Todo/Dayplan link");
  return data?.[0]?.id;
};

const createRecord = async (props: DataProps) => {
  const { data, errors } = await client.models.DailyPlanTodo.create({
    dailyPlanId: props.dayPlanId,
    todoId: props.todoId,
    postPoned: props.postponed,
    updatedAt: newDateTimeString(),
  });
  if (errors) handleApiErrors(errors, "Error creating Todo/Dayplan link");
  return data;
};

const updateRecord = async (recordId: string, postPoned: boolean) => {
  const { data, errors } = await client.models.DailyPlanTodo.update({
    id: recordId,
    postPoned,
    updatedAt: newDateTimeString(),
  });
  if (errors) handleApiErrors(errors, "Error updating Todo/Dayplan link");
  return data;
};

export const postponeTodo = async ({ data: props, options }: Props) => {
  options?.mutate?.(false);
  const recordId = await getRecordId(props.dayPlanId, props.todoId);
  const data = !recordId
    ? await createRecord(props)
    : await updateRecord(recordId, props.postponed);
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
