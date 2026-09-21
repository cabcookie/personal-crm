import type { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  queryByIndex,
  getItemRaw,
} from "../process-export-tasks/helpers/dynamodb";
import {
  upsertOneTimeSchedule,
  SNAPSHOT_DELAY_MINUTES,
  SUMMARY_DELAY_MINUTES,
  MEETING_HEADER_DELAY_MINUTES,
} from "./lib/scheduler";

/**
 * Trailing-debounce scheduler. Fires on four DynamoDB streams and re-arms
 * one-time schedules for the affected cached artifacts:
 *
 *   NoteBlock (content change)
 *     -> activity snapshot (+5)            keyed by activityId
 *     -> project summary   (+7)            per linked project
 *     -> meeting header    (+5)            if the activity belongs to a meeting
 *                                          (@-mentions may have changed)
 *   Meeting (topic/time change)
 *     -> meeting header    (+5)
 *   MeetingParticipant (added/removed)
 *     -> meeting header    (+5)
 *   ProjectActivity (link added/removed)
 *     -> activity snapshot (+5)            (activityHeader = "Topic: <projects>")
 *     -> project summary   (+7)
 *
 * Each edit overwrites the same-named schedule, so timers slide forward
 * together — snapshot (+5) always lands before the summary (+7) it feeds.
 * Image-description-only NoteBlock writes are ignored (a generated caption is
 * not a user note edit).
 */

const asRecord = (
  image: Record<string, AttributeValue> | undefined
): Record<string, unknown> | null =>
  image ? (unmarshall(image) as Record<string, unknown>) : null;

const newOrOld = (record: DynamoDBRecord): Record<string, unknown> | null =>
  asRecord(record.dynamodb?.NewImage as Record<string, AttributeValue>) ??
  asRecord(record.dynamodb?.OldImage as Record<string, AttributeValue>);

/** Table name from `arn:aws:dynamodb:…:table/NAME/stream/…`. */
const tableOf = (record: DynamoDBRecord): string => {
  const m = (record.eventSourceARN ?? "").match(/table\/([^/]+)\//);
  return m?.[1] ?? "";
};

const matches = (table: string, model: string): boolean =>
  new RegExp(`(^|[^a-z])${model}(-|$)`, "i").test(table);

/**
 * True when a NoteBlock MODIFY only touched the machine-written image
 * description and left the user-authored `content` unchanged.
 */
const isImageDescriptionOnlyChange = (record: DynamoDBRecord): boolean => {
  if (record.eventName !== "MODIFY") return false;
  const n = asRecord(
    record.dynamodb?.NewImage as Record<string, AttributeValue>
  );
  const o = asRecord(
    record.dynamodb?.OldImage as Record<string, AttributeValue>
  );
  if (!n || !o) return false;
  return (
    JSON.stringify(n.content ?? null) === JSON.stringify(o.content ?? null)
  );
};

/**
 * True when a MODIFY changed ONLY attributes in `ignore` (plus DynamoDB's
 * own `updatedAt`), i.e. nothing meaningful for our triggers changed. Used to
 * break feedback loops: our own cache writes (meetingHeaderMarkdown,
 * snapshotPending, …) land on tables that stream back into this Lambda; if we
 * re-armed on them we'd loop forever (throttled only by the debounce).
 */
const onlyIgnoredFieldsChanged = (
  record: DynamoDBRecord,
  ignore: string[]
): boolean => {
  if (record.eventName !== "MODIFY") return false;
  const n = asRecord(
    record.dynamodb?.NewImage as Record<string, AttributeValue>
  );
  const o = asRecord(
    record.dynamodb?.OldImage as Record<string, AttributeValue>
  );
  if (!n || !o) return false;
  const skip = new Set([...ignore, "updatedAt"]);
  const keys = new Set([...Object.keys(n), ...Object.keys(o)]);
  for (const k of keys) {
    if (skip.has(k)) continue;
    if (JSON.stringify(n[k] ?? null) !== JSON.stringify(o[k] ?? null)) {
      return false; // a meaningful field changed
    }
  }
  return true;
};

const projectIdsForActivity = async (
  activityId: string,
  owner: string
): Promise<string[]> => {
  const junctions = await queryByIndex(
    "ProjectActivity",
    "gsi-Activity.forProjects",
    "activityId",
    activityId,
    { owner }
  );
  return [
    ...new Set(
      junctions
        .map((j) => (j as { projectsId?: string }).projectsId)
        .filter((id): id is string => !!id)
    ),
  ];
};

const armActivity = async (
  activityId: string,
  owner: string,
  meetingId?: string | null
): Promise<void> => {
  const projectIds = await projectIdsForActivity(activityId, owner);
  await Promise.all([
    upsertOneTimeSchedule({
      kind: "snapshot",
      id: activityId,
      delayMinutes: SNAPSHOT_DELAY_MINUTES,
    }),
    ...projectIds.map((projectId) =>
      upsertOneTimeSchedule({
        kind: "summary",
        id: projectId,
        delayMinutes: SUMMARY_DELAY_MINUTES,
      })
    ),
    ...(meetingId
      ? [
          upsertOneTimeSchedule({
            kind: "meeting-header",
            id: meetingId,
            delayMinutes: MEETING_HEADER_DELAY_MINUTES,
          }),
        ]
      : []),
  ]);
  console.log(
    `[schedule] activity ${activityId}: snapshot + ${projectIds.length} summary` +
      (meetingId ? ` + meeting-header ${meetingId}` : "")
  );
};

const armMeetingHeader = async (meetingId: string): Promise<void> => {
  await upsertOneTimeSchedule({
    kind: "meeting-header",
    id: meetingId,
    delayMinutes: MEETING_HEADER_DELAY_MINUTES,
  });
  console.log(`[schedule] meeting-header ${meetingId}`);
};

const handleNoteBlock = async (record: DynamoDBRecord): Promise<void> => {
  if (isImageDescriptionOnlyChange(record)) return;
  const image = newOrOld(record);
  const activityId = image?.activityId as string | undefined;
  const owner = image?.owner as string | undefined;
  if (!activityId || !owner) return;
  // The NoteBlock image doesn't carry the meetingId; load the activity for it.
  const activity = await getItemRaw<{ meetingActivitiesId?: string | null }>(
    "Activity",
    activityId
  );
  await armActivity(activityId, owner, activity?.meetingActivitiesId ?? null);
};

const handleMeeting = async (record: DynamoDBRecord): Promise<void> => {
  // Break the loop: our own meeting-header write streams back here. Skip when
  // only the cached header fields changed (nothing the header depends on did).
  if (
    onlyIgnoredFieldsChanged(record, [
      "meetingHeaderMarkdown",
      "meetingHeaderMarkdownUpdatedAt",
    ])
  ) {
    return;
  }
  const image = newOrOld(record);
  const meetingId = image?.id as string | undefined;
  if (!meetingId) return;
  await armMeetingHeader(meetingId);
};

const handleMeetingParticipant = async (
  record: DynamoDBRecord
): Promise<void> => {
  const image = newOrOld(record);
  const meetingId = image?.meetingId as string | undefined;
  if (!meetingId) return;
  await armMeetingHeader(meetingId);
};

const handleProjectActivity = async (record: DynamoDBRecord): Promise<void> => {
  // Break the loop: the backfill worker clears `snapshotPending` on this row,
  // which streams back here. Skip when only that marker changed.
  if (onlyIgnoredFieldsChanged(record, ["snapshotPending"])) return;
  const image = newOrOld(record);
  const activityId = image?.activityId as string | undefined;
  const owner = image?.owner as string | undefined;
  if (!activityId || !owner) return;
  const activity = await getItemRaw<{ meetingActivitiesId?: string | null }>(
    "Activity",
    activityId
  );
  await armActivity(activityId, owner, activity?.meetingActivitiesId ?? null);
};

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const table = tableOf(record);
      if (matches(table, "NoteBlock")) {
        await handleNoteBlock(record);
      } else if (matches(table, "MeetingParticipant")) {
        await handleMeetingParticipant(record);
      } else if (matches(table, "Meeting")) {
        await handleMeeting(record);
      } else if (matches(table, "ProjectActivity")) {
        await handleProjectActivity(record);
      } else {
        console.warn(`[schedule] unrecognized stream table: ${table}`);
      }
    } catch (error) {
      console.error("[schedule] failed to process record", {
        eventID: record.eventID,
        error,
      });
    }
  }
};
