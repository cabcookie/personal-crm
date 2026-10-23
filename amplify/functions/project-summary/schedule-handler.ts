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
  PERSON_EMBEDDING_DELAY_MINUTES,
  PROJECT_EMBEDDING_DELAY_MINUTES,
  PERSON_SUMMARY_DELAY_MINUTES,
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
 * Person summary (+10, keyed by personId) is re-armed from:
 *   PersonLearning / PersonAccount / PersonRelationship / NoteBlockPerson /
 *   MeetingParticipant changes (the affected person ids), Person changes to
 *   name/howToSay/birthday, and NoteBlock content changes (people mentioned
 *   in the block + participants of the block's meeting).
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

const armPersonSummaries = async (
  personIds: (string | null | undefined)[]
): Promise<void> => {
  const ids = [...new Set(personIds.filter((id): id is string => !!id))];
  await Promise.all(
    ids.map((id) =>
      upsertOneTimeSchedule({
        kind: "person-summary",
        id,
        delayMinutes: PERSON_SUMMARY_DELAY_MINUTES,
      })
    )
  );
  if (ids.length) console.log(`[schedule] person-summary ${ids.join(", ")}`);
};

const mentionedPersonIds = async (
  noteBlockId: string,
  owner: string
): Promise<string[]> =>
  (
    await queryByIndex(
      "NoteBlockPerson",
      "gsi-NoteBlock.people",
      "noteBlockId",
      noteBlockId,
      { owner }
    )
  ).map((j) => (j as { personId?: string }).personId ?? "");

const meetingParticipantIds = async (
  meetingId: string,
  owner: string
): Promise<string[]> =>
  (
    await queryByIndex(
      "MeetingParticipant",
      "gsi-Meeting.participants",
      "meetingId",
      meetingId,
      { owner }
    )
  ).map((j) => (j as { personId?: string }).personId ?? "");

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
  const meetingId = activity?.meetingActivitiesId ?? null;
  await armActivity(activityId, owner, meetingId);

  // Person summaries: people mentioned in this block and the participants of
  // the block's meeting (their meeting notes changed).
  const blockId = image?.id as string | undefined;
  const [mentioned, participants] = await Promise.all([
    blockId ? mentionedPersonIds(blockId, owner) : Promise.resolve([]),
    meetingId ? meetingParticipantIds(meetingId, owner) : Promise.resolve([]),
  ]);
  await armPersonSummaries([...mentioned, ...participants]);
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
  await armPersonSummaries([image?.personId as string | undefined]);
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

const armPersonEmbedding = async (personId: string): Promise<void> => {
  await upsertOneTimeSchedule({
    kind: "person-embedding",
    id: personId,
    delayMinutes: PERSON_EMBEDDING_DELAY_MINUTES,
  });
  console.log(`[schedule] person-embedding ${personId}`);
};

// Person fields the summary pipeline (and touch-person-last-seen) write back
// onto Person. Changes to only these must never re-arm anything.
const PERSON_MACHINE_FIELDS = [
  "nameEmbedding",
  "nameEmbeddingSource",
  "nameEmbeddingUpdatedAt",
  "personSummary",
  "personSummarySource",
  "personSummaryUpdatedAt",
  "personSummaryPending",
  "lastSeen",
];

// Person fields that feed the person summary directly.
const PERSON_SUMMARY_FIELDS = ["name", "howToSay", "birthday"];

const personSummaryFieldsChanged = (record: DynamoDBRecord): boolean => {
  if (record.eventName !== "MODIFY") return false;
  const n = asRecord(
    record.dynamodb?.NewImage as Record<string, AttributeValue>
  );
  const o = asRecord(
    record.dynamodb?.OldImage as Record<string, AttributeValue>
  );
  if (!n || !o) return false;
  return PERSON_SUMMARY_FIELDS.some(
    (k) => JSON.stringify(n[k] ?? null) !== JSON.stringify(o[k] ?? null)
  );
};

const handlePerson = async (record: DynamoDBRecord): Promise<void> => {
  // Break the loop: our own embedding/summary writes (and lastSeen touches)
  // stream back here. Skip when only those machine fields changed.
  if (onlyIgnoredFieldsChanged(record, PERSON_MACHINE_FIELDS)) return;
  const image = newOrOld(record);
  const personId = image?.id as string | undefined;
  if (!personId) return;
  await armPersonEmbedding(personId);
  // A brand-new person has nothing to summarise yet; only re-arm on edits of
  // the facts the summary uses.
  if (personSummaryFieldsChanged(record)) await armPersonSummaries([personId]);
};

const handlePersonAccount = async (record: DynamoDBRecord): Promise<void> => {
  // Employment (company/role) drives the embedded string and the summary.
  const image = newOrOld(record);
  const personId = image?.personId as string | undefined;
  if (!personId) return;
  await armPersonEmbedding(personId);
  await armPersonSummaries([personId]);
};

const handlePersonLearning = async (record: DynamoDBRecord): Promise<void> => {
  await armPersonSummaries([newOrOld(record)?.personId as string | undefined]);
};

const handlePersonRelationship = async (
  record: DynamoDBRecord
): Promise<void> => {
  const image = newOrOld(record);
  await armPersonSummaries([
    image?.personId as string | undefined,
    image?.relatedPersonId as string | undefined,
  ]);
};

const handleNoteBlockPerson = async (record: DynamoDBRecord): Promise<void> => {
  await armPersonSummaries([newOrOld(record)?.personId as string | undefined]);
};

const armProjectEmbedding = async (projectId: string): Promise<void> => {
  await upsertOneTimeSchedule({
    kind: "project-embedding",
    id: projectId,
    delayMinutes: PROJECT_EMBEDDING_DELAY_MINUTES,
  });
  console.log(`[schedule] project-embedding ${projectId}`);
};

const handleProjects = async (record: DynamoDBRecord): Promise<void> => {
  // Only the project name + summary drive the embedding. Skip when neither
  // changed — this also breaks the loop from our own embedding write and from
  // the frequent unrelated Projects edits (order, pinned, tasksSummary, next
  // actions, etc.). On INSERT (no OldImage) we always arm.
  if (record.eventName === "MODIFY") {
    const n = asRecord(
      record.dynamodb?.NewImage as Record<string, AttributeValue>
    );
    const o = asRecord(
      record.dynamodb?.OldImage as Record<string, AttributeValue>
    );
    if (n && o) {
      const nameChanged =
        JSON.stringify(n.project ?? null) !== JSON.stringify(o.project ?? null);
      const summaryChanged =
        JSON.stringify(n.projectSummary ?? null) !==
        JSON.stringify(o.projectSummary ?? null);
      if (!nameChanged && !summaryChanged) return;
    }
  }
  const image = newOrOld(record);
  const projectId = image?.id as string | undefined;
  if (!projectId) return;
  await armProjectEmbedding(projectId);
};

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const table = tableOf(record);
      if (matches(table, "NoteBlockPerson")) {
        await handleNoteBlockPerson(record);
      } else if (matches(table, "NoteBlock")) {
        await handleNoteBlock(record);
      } else if (matches(table, "MeetingParticipant")) {
        await handleMeetingParticipant(record);
      } else if (matches(table, "Meeting")) {
        await handleMeeting(record);
      } else if (matches(table, "ProjectActivity")) {
        await handleProjectActivity(record);
      } else if (matches(table, "Projects")) {
        await handleProjects(record);
      } else if (matches(table, "PersonLearning")) {
        await handlePersonLearning(record);
      } else if (matches(table, "PersonRelationship")) {
        await handlePersonRelationship(record);
      } else if (matches(table, "PersonAccount")) {
        await handlePersonAccount(record);
      } else if (matches(table, "Person")) {
        await handlePerson(record);
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
