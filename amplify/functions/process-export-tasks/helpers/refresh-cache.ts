import {
  DynamoDBClient,
  UpdateItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getItemRaw, queryByIndex } from "./dynamodb";
import type { ActivityRecord } from "./activities";
import {
  computeActivityBody,
  computeActivityHeader,
  computeMeetingHeader,
} from "../../project-summary/lib/render";

/**
 * Synchronous cache refresh for the "Export for AI" path.
 *
 * The export now reads the cached building blocks (notesMarkdown,
 * activityHeaderMarkdown, meetingHeaderMarkdown). To make sure a click never
 * hits stale or missing cache — e.g. right after a meeting ends, before the
 * 5-min debounce fired — the export handler calls these to (re)compute the
 * cache inline, then assembles from it. This runs the SAME compute functions
 * the scheduler Lambdas use, so the result is identical; we just skip the
 * scheduler and do it now.
 *
 * Writes go directly to DynamoDB (owner-preserving), like the rest of the
 * pipeline. Requires the `DDB_TABLE_<MODEL>` env vars (already injected on the
 * export Lambda for its read tables) and UpdateItem permission on Activity +
 * Meeting (granted in custom/backend/export-tasks.ts).
 */

const client = new DynamoDBClient({});

const tableName = (model: string): string => {
  const name = process.env[`DDB_TABLE_${model.toUpperCase()}`];
  if (!name) throw new Error(`Missing env DDB_TABLE_${model.toUpperCase()}`);
  return name;
};

const setAttributes = async (
  model: string,
  id: string,
  attrs: Record<string, string>,
  owner: string
): Promise<void> => {
  const names: Record<string, string> = { "#owner": "owner" };
  const values: Record<string, AttributeValue> = {
    ":owner": { S: owner },
  };
  const sets: string[] = [];
  Object.entries(attrs).forEach(([k, v], i) => {
    names[`#a${i}`] = k;
    values[`:v${i}`] = marshall({ v }, { removeUndefinedValues: true }).v;
    sets.push(`#a${i} = :v${i}`);
  });
  await client.send(
    new UpdateItemCommand({
      TableName: tableName(model),
      Key: { id: { S: id } },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ConditionExpression: "#owner = :owner",
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
};

const refreshActivity = async (
  activity: ActivityRecord & { owner?: string },
  owner: string
): Promise<void> => {
  const [body, header] = await Promise.all([
    computeActivityBody(activity, { owner }),
    computeActivityHeader(activity, { owner }),
  ]);
  const now = new Date().toISOString();
  await setAttributes(
    "Activity",
    activity.id,
    {
      notesMarkdown: body,
      notesMarkdownUpdatedAt: now,
      activityHeaderMarkdown: header,
      activityHeaderMarkdownUpdatedAt: now,
    },
    owner
  );
};

const refreshMeeting = async (
  meetingId: string,
  owner: string
): Promise<void> => {
  const meeting = await getItemRaw<{
    id: string;
    topic?: string | null;
    meetingOn?: string | null;
    createdAt?: string | null;
  }>("Meeting", meetingId);
  if (!meeting) return;
  const header = await computeMeetingHeader(meeting, { owner });
  await setAttributes(
    "Meeting",
    meetingId,
    {
      meetingHeaderMarkdown: header,
      meetingHeaderMarkdownUpdatedAt: new Date().toISOString(),
    },
    owner
  );
};

const activityIdsForProject = async (
  projectId: string,
  owner: string
): Promise<string[]> => {
  const junctions = await queryByIndex(
    "ProjectActivity",
    "projectActivitiesByProjectsId",
    "projectsId",
    projectId,
    { owner }
  );
  return [
    ...new Set(
      junctions
        .map((j) => (j as { activityId?: string }).activityId)
        .filter((id): id is string => !!id)
    ),
  ];
};

const activityIdsForMeeting = async (
  meetingId: string,
  owner: string
): Promise<ActivityRecord[]> =>
  queryByIndex<ActivityRecord>(
    "Activity",
    "gsi-Meeting.activities",
    "meetingActivitiesId",
    meetingId,
    { owner }
  );

/**
 * Refresh every cached block a PROJECT export will read: each linked activity's
 * body+header, and the header of every meeting those activities belong to.
 */
export const refreshProjectCache = async (
  projectId: string,
  owner: string
): Promise<void> => {
  const activityIds = await activityIdsForProject(projectId, owner);
  const activities = (
    await Promise.all(
      activityIds.map((id) =>
        getItemRaw<ActivityRecord & { owner?: string }>("Activity", id)
      )
    )
  ).filter((a): a is ActivityRecord & { owner?: string } => !!a);

  await Promise.all(activities.map((a) => refreshActivity(a, owner)));

  const meetingIds = [
    ...new Set(
      activities
        .map((a) => a.meetingActivitiesId)
        .filter((id): id is string => !!id)
    ),
  ];
  await Promise.all(meetingIds.map((id) => refreshMeeting(id, owner)));
};

/**
 * Refresh every cached block a MEETING export will read: the meeting header
 * and each of its activities' body+header.
 */
export const refreshMeetingCache = async (
  meetingId: string,
  owner: string
): Promise<void> => {
  const activities = await activityIdsForMeeting(meetingId, owner);
  await Promise.all(
    activities.map((a) =>
      refreshActivity(a as ActivityRecord & { owner?: string }, owner)
    )
  );
  await refreshMeeting(meetingId, owner);
};
