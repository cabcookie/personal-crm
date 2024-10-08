import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flatMap, flow, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const selectionSet = [
  "projects.activities.activity.id",
  "projects.activities.activity.createdAt",
  "projects.activities.activity.finishedOn",
] as const;

type ActivityData = SelectionSet<
  Schema["AccountProjects"]["type"],
  typeof selectionSet
>;
type ProjectActivityData =
  ActivityData["projects"]["activities"][number]["activity"];

type AccountActivity = {
  id: string;
  finishedOn: Date;
};

const mapActivity = ({
  id,
  createdAt,
  finishedOn,
}: ProjectActivityData): AccountActivity => ({
  id,
  finishedOn: new Date(finishedOn || createdAt),
});

const fetchAccountActivities = (accountId?: string) => async () => {
  if (!accountId) return;
  const { data, errors } =
    await client.models.AccountProjects.listAccountProjectsByAccountId(
      { accountId },
      {
        selectionSet,
      }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading account activities");
    throw errors;
  }
  if (!data)
    throw new Error(`Receive account activities failed for ${accountId}`);
  try {
    return flow(
      flatMap((d: ActivityData) => d.projects.activities),
      map("activity"),
      filter((a) => !!a),
      map(mapActivity),
      sortBy((a: AccountActivity) => -a.finishedOn.getTime())
    )(data);
  } catch (error) {
    console.error("fetchAccountActivities", { error });
    throw error;
  }
};

const useAccountActivities = (accountId: string) => {
  const { data: activities } = useSWR(
    `/api/projects/account/${accountId}`,
    fetchAccountActivities(accountId)
  );
  return { activities };
};

export default useAccountActivities;
