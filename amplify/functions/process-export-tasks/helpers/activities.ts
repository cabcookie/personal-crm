import type { JSONContent } from "@tiptap/core";
import { differenceInCalendarDays } from "date-fns";
import { getItem, queryByIndex, batchGetItems } from "./dynamodb";
import { getMarkdown } from "./markdown";
import { bumpHeadings, renderListItemNode } from "./tiptap-doc";

const LIST_TYPES = new Set(["listItem", "listItemOrdered", "taskItem"]);

const LOCALE = "de-DE";
const TIMEZONE = "Europe/Berlin";

const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(LOCALE, {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================= types ============================= */

type OwnerOpts = { owner: string };

type Employment = {
  accountName: string | null;
  position: string | null;
};

type MeetingInfo = {
  topic?: string | null;
  meetingOn?: string | null;
  createdAt?: string | null;
  participants: string[];
  participantIds: string[];
};

export type BlockRecord = {
  id: string;
  type?: string;
  content?: JSONContent | string | null;
  todoId?: string | null;
  todo?: TodoRecord | null;
  [k: string]: unknown;
};

type TodoRecord = {
  id: string;
  todo?: JSONContent | string | null;
  status?: "OPEN" | "DONE";
  [k: string]: unknown;
};

export type ActivityRecord = {
  id: string;
  noteBlockIds?: string[];
  meetingActivitiesId?: string | null;
  finishedOn?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  meeting?: MeetingInfo | null;
  blocks?: BlockRecord[];
  mentions?: string[];
  [k: string]: unknown;
};

/* ====================== people + employments ====================== */

const isoToday = (): string => new Date().toISOString().slice(0, 10);

const isCurrentEmployment = (
  pa: { startDate?: string | null; endDate?: string | null },
  today: string
): boolean => {
  if (pa.startDate && pa.startDate > today) return false;
  if (pa.endDate && pa.endDate < today) return false;
  return true;
};

export const fetchCurrentEmployment = async (
  personId: string,
  opts: OwnerOpts
): Promise<Employment | null> => {
  const pas = await queryByIndex(
    "PersonAccount",
    "gsi-Person.accounts",
    "personId",
    personId,
    opts
  );
  const valid = pas.filter((pa) => isCurrentEmployment(pa as any, isoToday()));
  if (!valid.length) return null;
  valid.sort((a, b) =>
    ((b as any).startDate || "").localeCompare((a as any).startDate || "")
  );
  const current = valid[0] as {
    accountId?: string;
    position?: string | null;
  };
  const account = current.accountId
    ? await getItem("Account", current.accountId, opts)
    : null;
  return {
    accountName: (account as { name?: string | null } | null)?.name ?? null,
    position: current.position ?? null,
  };
};

export const renderParticipant = (
  name: string,
  employment: Employment | null
): string => {
  const parts: string[] = [];
  if (employment?.accountName) parts.push(employment.accountName);
  if (employment?.position) parts.push(employment.position);
  return parts.length ? `${name} (${parts.join(", ")})` : name;
};

/* ======================== meeting + participants ==================== */

const fetchMeetingParticipants = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<{ rendered: string[]; ids: string[] }> => {
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
  const personMap = await batchGetItems("Person", personIds, opts);
  const people = personIds
    .map((id) => personMap.get(id))
    .filter((p): p is { id: string; name: string } => !!p && !!(p as any).name);
  const employments = await Promise.all(
    people.map((p) => fetchCurrentEmployment(p.id, opts))
  );
  return {
    rendered: people.map((p, i) => renderParticipant(p.name, employments[i])),
    ids: people.map((p) => p.id),
  };
};

const fetchMeeting = async (
  meetingId: string | null | undefined,
  opts: OwnerOpts
): Promise<MeetingInfo | null> => {
  if (!meetingId) return null;
  const meeting = await getItem<{
    topic?: string | null;
    meetingOn?: string | null;
    createdAt?: string | null;
  }>("Meeting", meetingId, opts);
  if (!meeting) return null;
  const { rendered, ids } = await fetchMeetingParticipants(meetingId, opts);
  return {
    topic: meeting.topic ?? null,
    meetingOn: meeting.meetingOn ?? null,
    createdAt: meeting.createdAt ?? null,
    participants: rendered,
    participantIds: ids,
  };
};

/* ============================= mentions ============================ */

const walkCollectMentions = (
  node: JSONContent | null | undefined,
  out: Map<string, string | null>
): void => {
  if (!node) return;
  if (node.type === "mention" && node.attrs?.id) {
    out.set(node.attrs.id as string, (node.attrs.label as string) ?? null);
  }
  if (Array.isArray(node.content)) {
    node.content.forEach((c) => walkCollectMentions(c, out));
  }
};

const parseContent = (
  content: JSONContent | string | null | undefined
): JSONContent | null => {
  if (!content) return null;
  return typeof content === "string"
    ? (JSON.parse(content) as JSONContent)
    : content;
};

const collectMentionsFromBlocks = (
  blocks: BlockRecord[]
): Map<string, string | null> => {
  const out = new Map<string, string | null>();
  for (const block of blocks ?? []) {
    if (block.type === "taskItem" && block.todo?.todo) {
      walkCollectMentions(parseContent(block.todo.todo), out);
    } else if (block.content) {
      walkCollectMentions(parseContent(block.content), out);
    }
  }
  return out;
};

const resolveMentions = async (
  mentionsMap: Map<string, string | null>,
  excludeIds: string[],
  opts: OwnerOpts
): Promise<string[]> => {
  const exclude = new Set(excludeIds);
  const entries = [...mentionsMap.entries()].filter(([id]) => !exclude.has(id));
  const ids = entries.map(([id]) => id);
  const personMap = await batchGetItems("Person", ids, opts);
  const employments = await Promise.all(
    ids.map((id) => fetchCurrentEmployment(id, opts))
  );
  return entries
    .map(([id, label], i) => {
      const name =
        (personMap.get(id) as { name?: string } | undefined)?.name ?? label;
      return name ? renderParticipant(name, employments[i]) : null;
    })
    .filter((s): s is string => !!s);
};

/* =========================== blocks fetch ========================== */

export const fetchBlocks = async (
  activity: ActivityRecord,
  opts: OwnerOpts
): Promise<BlockRecord[]> => {
  const ids = (activity.noteBlockIds ?? []).filter(Boolean);
  if (!ids.length) return [];
  const blockMap = await batchGetItems<BlockRecord>("NoteBlock", ids, opts);
  const blocks = ids
    .map((id) => blockMap.get(id))
    .filter((b): b is BlockRecord => !!b);
  const todoIds = blocks
    .filter((b) => b.type === "taskItem" && b.todoId)
    .map((b) => b.todoId!)
    .filter(Boolean);
  const todoMap = await batchGetItems<TodoRecord>("Todo", todoIds, opts);
  return blocks.map((b) =>
    b.type === "taskItem" && b.todoId && todoMap.has(b.todoId)
      ? { ...b, todo: todoMap.get(b.todoId)! }
      : b
  );
};

/* ============================ enrichment =========================== */

const enrichActivity = async (
  activity: ActivityRecord,
  opts: OwnerOpts
): Promise<ActivityRecord> => {
  const meeting = await fetchMeeting(activity.meetingActivitiesId, opts);
  const blocks = await fetchBlocks(activity, opts);
  const mentions = await resolveMentions(
    collectMentionsFromBlocks(blocks),
    meeting?.participantIds ?? [],
    opts
  );
  return { ...activity, meeting, blocks, mentions };
};

export const fetchActivitiesForProject = async (
  projectId: string,
  opts: OwnerOpts
): Promise<ActivityRecord[]> => {
  const junctions = await queryByIndex(
    "ProjectActivity",
    "projectActivitiesByProjectsId",
    "projectsId",
    projectId,
    opts
  );
  const activityIds = junctions
    .map((j) => (j as { activityId?: string }).activityId)
    .filter((id): id is string => !!id);
  const activityMap = await batchGetItems<ActivityRecord>(
    "Activity",
    activityIds,
    opts
  );
  const activities = activityIds
    .map((id) => activityMap.get(id))
    .filter((a): a is ActivityRecord => !!a);
  return Promise.all(activities.map((a) => enrichActivity(a, opts)));
};

/* ============================ rendering ============================ */

const pickHeadingDate = (activity: ActivityRecord): string | null =>
  activity.meeting?.meetingOn ||
  activity.meeting?.createdAt ||
  activity.finishedOn ||
  activity.createdAt ||
  null;

const pickHeadingDateTime = (activity: ActivityRecord): Date | null => {
  const s = pickHeadingDate(activity);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

export type DateWindow = { startDate: Date; endDate: Date };

/** Inclusive on both ends, calendar-day granularity. */
export const withinDateWindow = (
  activity: ActivityRecord,
  { startDate, endDate }: DateWindow
): boolean => {
  const d = pickHeadingDateTime(activity);
  if (!d) return false;
  return (
    differenceInCalendarDays(d, startDate) >= 0 &&
    differenceInCalendarDays(endDate, d) >= 0
  );
};

const renderBlock = (block: BlockRecord): string => {
  // Handled by the top-level walker for list types.
  if (!block.content) return "";
  return getMarkdown(parseContent(block.content) as JSONContent);
};

export const renderBlocks = (blocks: BlockRecord[] | undefined): string => {
  const parts: string[] = [];
  let orderedCount = 0;
  let prevType: string | undefined;
  for (const block of blocks ?? []) {
    if (block.type !== "listItemOrdered") orderedCount = 0;

    const isList = LIST_TYPES.has(block.type ?? "");
    const prevWasList = LIST_TYPES.has(prevType ?? "");
    if (!isList && prevWasList) parts.push("\n");

    if (block.type === "listItem" && block.content) {
      parts.push(
        renderListItemNode(parseContent(block.content)!, 0, "-") + "\n"
      );
    } else if (block.type === "listItemOrdered" && block.content) {
      orderedCount += 1;
      parts.push(
        renderListItemNode(
          parseContent(block.content)!,
          0,
          `${orderedCount}.`
        ) + "\n"
      );
    } else if (block.type === "taskItem" && block.todo?.todo) {
      const parsed = parseContent(block.todo.todo);
      if (parsed) {
        const checked = block.todo.status === "DONE";
        parts.push(renderListItemNode(parsed, 0, "-", checked) + "\n");
      }
    } else {
      const md = renderBlock(block);
      if (md.trim()) parts.push(md);
    }

    prevType = block.type;
  }
  return parts.join("").trim();
};

export const renderActivity = (
  activity: ActivityRecord,
  headingLevel = 2
): string => {
  const hashes = "#".repeat(headingLevel);
  const date = formatDateTime(pickHeadingDate(activity));
  const meetingPart = activity.meeting?.topic
    ? `, Meeting: ${activity.meeting.topic}`
    : "";
  const lines: string[] = [`${hashes} ${date}${meetingPart}`];
  if (activity.meeting?.participants?.length) {
    lines.push(
      "",
      `**Participants:** ${activity.meeting.participants.join(", ")}`
    );
  }
  if (activity.mentions?.length) {
    if (!activity.meeting?.participants?.length) lines.push("");
    lines.push(`**People mentioned:** ${activity.mentions.join(", ")}`);
  }
  const body = bumpHeadings(
    renderBlocks(activity.blocks),
    Math.max(0, headingLevel - 2)
  );
  if (body) lines.push("", body);
  return lines.join("\n");
};

export const renderActivitiesSection = (
  activities: ActivityRecord[],
  headingLevel = 2
): string =>
  activities
    .slice()
    .sort((a, b) => {
      const da = pickHeadingDate(a) ?? "";
      const db = pickHeadingDate(b) ?? "";
      return da < db ? 1 : da > db ? -1 : 0;
    })
    .map((a) => renderActivity(a, headingLevel))
    .join("\n\n");
