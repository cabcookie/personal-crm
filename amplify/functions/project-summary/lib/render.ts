import type { JSONContent } from "@tiptap/core";
import {
  fetchBlocks,
  fetchCurrentEmployment,
  renderBlocks,
  renderParticipant,
  type ActivityRecord,
  type BlockRecord,
} from "../../process-export-tasks/helpers/activities";
import {
  batchGetItems,
  getItemRaw,
  queryByIndex,
} from "../../process-export-tasks/helpers/dynamodb";

/**
 * Pure, directly-callable render functions for the cached markdown building
 * blocks. Both the debounced scheduler Lambdas AND the synchronous
 * "Export for AI" path call these — the export path just runs them inline and
 * skips the scheduler so it never sees a stale/missing cache.
 *
 * They only READ from DynamoDB (owner-filtered) and return strings; the caller
 * persists the result. None of them add a leading '#': the export routine
 * decides the heading level (and how deep to bump the body's own headings).
 *
 * Table access needs the DDB_TABLE_<MODEL> env vars injected by the CDK wiring.
 */

type OwnerOpts = { owner: string };

const TIMEZONE = "Europe/Berlin";

/**
 * Meeting/standalone date format: `YYYY-MM-DD HH:mm CET` in Europe/Berlin.
 * Matches the meeting export's format (the literal "CET" label is used
 * year-round per the existing export behaviour).
 */
export const formatHeaderDateTime = (
  iso: string | null | undefined
): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")} CET`;
};

/* ===================== activity body (notesMarkdown) ===================== */

/**
 * Render an activity's note blocks to markdown (the cached `notesMarkdown`
 * body). Identical output to the export's per-activity body. No header.
 */
export const computeActivityBody = async (
  activity: ActivityRecord,
  opts: OwnerOpts
): Promise<string> => {
  const blocks = await fetchBlocks(activity, opts);
  return renderBlocks(blocks);
};

/* ==================== activity header (activityHeader) ==================== */

const projectNamesForActivity = async (
  activityId: string,
  opts: OwnerOpts
): Promise<string[]> => {
  const junctions = await queryByIndex(
    "ProjectActivity",
    "gsi-Activity.forProjects",
    "activityId",
    activityId,
    opts
  );
  const projectIds = [
    ...new Set(
      junctions
        .map((j) => (j as { projectsId?: string }).projectsId)
        .filter((id): id is string => !!id)
    ),
  ];
  if (!projectIds.length) return [];
  const projectMap = await batchGetItems<{ id: string; project?: string }>(
    "Projects",
    projectIds,
    opts
  );
  return projectIds
    .map((id) => projectMap.get(id)?.project)
    .filter((n): n is string => !!n);
};

const pickActivityDate = (a: ActivityRecord): string | null =>
  a.finishedOn || a.createdAt || (a.updatedAt as string | undefined) || null;

/**
 * Compute the cached `activityHeaderMarkdown` (no leading '#'):
 *  - meeting-linked activity -> "Topic: <project names>"
 *  - standalone note         -> the activity date ("YYYY-MM-DD HH:mm CET")
 */
export const computeActivityHeader = async (
  activity: ActivityRecord,
  opts: OwnerOpts
): Promise<string> => {
  if (activity.meetingActivitiesId) {
    const names = await projectNamesForActivity(activity.id, opts);
    return names.length ? `Topic: ${names.join(", ")}` : "Topic:";
  }
  return formatHeaderDateTime(pickActivityDate(activity));
};

/* ===================== meeting header (meetingHeader) ===================== */

type MeetingRecord = {
  id: string;
  topic?: string | null;
  meetingOn?: string | null;
  createdAt?: string | null;
  owner?: string;
};

const parseContent = (
  content: JSONContent | string | null | undefined
): JSONContent | null => {
  if (!content) return null;
  try {
    return typeof content === "string"
      ? (JSON.parse(content) as JSONContent)
      : content;
  } catch {
    return null;
  }
};

const walkMentions = (
  node: JSONContent | null | undefined,
  out: Map<string, string | null>
): void => {
  if (!node) return;
  if (node.type === "mention" && node.attrs?.id) {
    out.set(node.attrs.id as string, (node.attrs.label as string) ?? null);
  }
  if (Array.isArray(node.content))
    node.content.forEach((c) => walkMentions(c, out));
};

const collectMentions = (blocks: BlockRecord[]): Map<string, string | null> => {
  const out = new Map<string, string | null>();
  for (const b of blocks) {
    if (b.type === "taskItem" && b.todo?.todo) {
      walkMentions(parseContent(b.todo.todo), out);
    } else if (b.content) {
      walkMentions(parseContent(b.content), out);
    }
  }
  return out;
};

const fetchMeetingParticipants = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<{ rendered: string[]; ids: Set<string> }> => {
  const junctions = await queryByIndex(
    "MeetingParticipant",
    "gsi-Meeting.participants",
    "meetingId",
    meetingId,
    opts
  );
  const personIds = junctions
    .map((j) => (j as { personId?: string }).personId)
    .filter((id): id is string => !!id);
  const personMap = await batchGetItems<{ id: string; name?: string }>(
    "Person",
    personIds,
    opts
  );
  const people = personIds
    .map((id) => personMap.get(id))
    .filter((p): p is { id: string; name: string } => !!p && !!p.name);
  const employments = await Promise.all(
    people.map((p) => fetchCurrentEmployment(p.id, opts))
  );
  return {
    rendered: people.map((p, i) => renderParticipant(p.name, employments[i])),
    ids: new Set(people.map((p) => p.id)),
  };
};

const fetchMeetingActivities = (
  meetingId: string,
  opts: OwnerOpts
): Promise<ActivityRecord[]> =>
  queryByIndex<ActivityRecord>(
    "Activity",
    "gsi-Meeting.activities",
    "meetingActivitiesId",
    meetingId,
    opts
  );

/**
 * Resolve @-mentions across all of a meeting's activities, deduped and with
 * participants excluded, rendered as "Name (Company, Role)".
 */
const mentionedNonParticipants = async (
  meetingId: string,
  participantIds: Set<string>,
  opts: OwnerOpts
): Promise<string[]> => {
  const activities = await fetchMeetingActivities(meetingId, opts);
  const mentions = new Map<string, string | null>();
  for (const activity of activities) {
    const blocks = await fetchBlocks(activity, opts);
    for (const [id, label] of collectMentions(blocks)) mentions.set(id, label);
  }
  const ids = [...mentions.keys()].filter((id) => !participantIds.has(id));
  if (!ids.length) return [];
  const personMap = await batchGetItems<{ id: string; name?: string }>(
    "Person",
    ids,
    opts
  );
  const employments = await Promise.all(
    ids.map((id) => fetchCurrentEmployment(id, opts))
  );
  return ids
    .map((id, i) => {
      const name = personMap.get(id)?.name ?? mentions.get(id) ?? null;
      return name ? renderParticipant(name, employments[i]) : null;
    })
    .filter((s): s is string => !!s);
};

/**
 * Compute the cached `meetingHeaderMarkdown` (no leading '#'):
 *   "<de date>, Meeting: <topic>"
 *   "**Participants:** …"
 *   "**People mentioned:** …"  (mentioned but not participating)
 */
export const computeMeetingHeader = async (
  meeting: MeetingRecord,
  opts: OwnerOpts
): Promise<string> => {
  const dateStr = formatHeaderDateTime(meeting.meetingOn || meeting.createdAt);
  const topic = meeting.topic?.trim();
  const lines: string[] = [
    `${dateStr}${topic ? `, Meeting: ${topic}` : ""}`.trim(),
  ];

  const { rendered: participants, ids: participantIds } =
    await fetchMeetingParticipants(meeting.id, opts);
  if (participants.length) {
    lines.push("", `**Participants:** ${participants.join(", ")}`);
  }

  const mentioned = await mentionedNonParticipants(
    meeting.id,
    participantIds,
    opts
  );
  if (mentioned.length) {
    if (!participants.length) lines.push("");
    lines.push(`**People mentioned:** ${mentioned.join(", ")}`);
  }

  return lines.join("\n");
};

/* ============================ record loaders ============================ */

/** Load an Activity by id (raw, to recover owner) — used by the callers. */
export const loadActivity = (
  activityId: string
): Promise<(ActivityRecord & { owner?: string }) | null> =>
  getItemRaw<ActivityRecord & { owner?: string }>("Activity", activityId);

/** Load a Meeting by id (raw, to recover owner). */
export const loadMeeting = (meetingId: string): Promise<MeetingRecord | null> =>
  getItemRaw<MeetingRecord>("Meeting", meetingId);

export type { MeetingRecord };

// Note: project/meeting assembly from cache now lives in
// process-export-tasks/helpers/cached-assembly.ts (shared by the export
// Lambda and the summary Lambda). Import assembleProjectFromCache from there.
