import { CrudOptions, handleApiErrors } from "../globals";
import { client } from "@/lib/amplify";

interface DataProps {
  dayPlanId: string;
  done: boolean;
}

interface Props {
  data: DataProps;
  options?: CrudOptions;
}

export const finishDayplan = async ({
  data: { dayPlanId, done },
  options,
}: Props) => {
  options?.mutate?.(false);
  const { data, errors } = await client.models.DailyPlan.update({
    id: dayPlanId,
    status: done ? "DONE" : "OPEN",
  });
  if (errors) handleApiErrors(errors, "Updating dayplan's state failed");
  options?.mutate?.(true);
  options?.confirm?.();
  return data;
};
