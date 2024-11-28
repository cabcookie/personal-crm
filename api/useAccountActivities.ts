import { type Schema } from "@/amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { filter, flatMap, flow, map, sortBy, union, uniqBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const selectionSetAccount = [
  "projects.activities.activity.id",
  "projects.activities.activity.createdAt",
  "projects.activities.activity.finishedOn",
  "projects.activities.activity.forProjects.projects.id",
  "projects.activities.activity.meetingActivitiesId",
] as const;

type ActivityAccountData = SelectionSet<
  Schema["AccountProjects"]["type"],
  typeof selectionSetAccount
>;
type ProjectActivityAccountData =
  ActivityAccountData["projects"]["activities"][number]["activity"];

const selectionSetPartner = [
  "activities.activity.id",
  "activities.activity.createdAt",
  "activities.activity.finishedOn",
  "activities.activity.forProjects.projects.id",
  "activities.activity.meetingActivitiesId",
] as const;

type ActivityPartnerData = SelectionSet<
  Schema["Projects"]["type"],
  typeof selectionSetPartner
>;

type ProjectActivityPartnerData =
  ActivityPartnerData["activities"][number]["activity"];

type AccountActivity = {
  id: string;
  finishedOn: Date;
  projectIds: string[];
  meetingId?: string;
};

const mapActivityAccount = ({
  id,
  createdAt,
  finishedOn,
  forProjects,
  meetingActivitiesId,
}: ProjectActivityAccountData): AccountActivity => ({
  id,
  finishedOn: new Date(finishedOn || createdAt),
  projectIds: forProjects?.map((p) => p.projects.id) ?? [],
  meetingId: meetingActivitiesId || undefined,
});

const mapActivityPartner = ({
  id,
  createdAt,
  finishedOn,
  forProjects,
  meetingActivitiesId,
}: ProjectActivityPartnerData): AccountActivity => ({
  id,
  finishedOn: new Date(finishedOn || createdAt),
  projectIds: forProjects?.map((p) => p.projects.id) ?? [],
  meetingId: meetingActivitiesId || undefined,
});

const fetchPartnerActivities = async (accountId: string) => {
  const { data, errors } = await client.models.Projects.listByPartnerId(
    {
      partnerId: accountId,
    },
    {
      selectionSet: selectionSetPartner,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading partner activities");
    throw errors;
  }
  if (!data)
    throw new Error(`Receive partner activities failed for ${accountId}`);
  try {
    return flow(
      flatMap((d: ActivityPartnerData) => d.activities),
      map("activity"),
      filter((a) => !!a),
      map(mapActivityPartner),
      sortBy((a: AccountActivity) => -a.finishedOn.getTime())
    )(data);
  } catch (error) {
    console.error("fetchPartnerActivities", { error });
    throw error;
  }
};

const fetchAccountActivities = (accountId?: string) => async () => {
  if (!accountId) return;
  const partnerActivities = await fetchPartnerActivities(accountId);
  const { data, errors } =
    await client.models.AccountProjects.listAccountProjectsByAccountId(
      { accountId },
      {
        selectionSet: selectionSetAccount,
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
      flatMap((d: ActivityAccountData) => d.projects.activities),
      map("activity"),
      filter((a) => !!a),
      map(mapActivityAccount),
      union(partnerActivities),
      uniqBy<AccountActivity>("id"),
      sortBy((a) => -a.finishedOn.getTime())
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
