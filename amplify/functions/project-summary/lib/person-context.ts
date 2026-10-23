import {
  DynamoDBClient,
  QueryCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { createHash } from "crypto";
import type { JSONContent } from "@tiptap/core";
import {
  batchGetItems,
  getItemRaw,
  queryByIndex,
  type DdbRecord,
} from "../../process-export-tasks/helpers/dynamodb";
import {
  fetchBlocks,
  renderBlocks,
} from "../../process-export-tasks/helpers/activities";
import { assembleMeetingFromCache } from "../../process-export-tasks/helpers/cached-assembly";
import { getMarkdown } from "../../process-export-tasks/helpers/markdown";
import { bumpHeadings } from "../../process-export-tasks/helpers/tiptap-doc";

/**
 * Loads and renders everything the CRM knows about one person as Markdown,
 * the input for the person-summary prompt.
 *
 * Split into a LOADER (`loadPersonContext`, DynamoDB reads) and a pure
 * RENDERER (`renderPersonContext`) so the rendering and the change hash can be
 * unit-tested without AWS.
 *
 * Sources (all owner-scoped):
 *  - PersonAccount (+ Account names): all employments, current and past
 *  - PersonRelationship (both directions, + the other person's name)
 *  - PersonLearning with status "new", newest first
 *  - MeetingParticipant: meetings of the last 12 months (max 15), each
 *    assembled from the cached meeting/activity markdown
 *  - NoteBlockPerson: blocks mentioning the person in the last 12 months
 *    (max 30), grouped by activity; blocks of meetings already included above
 *    are skipped to avoid duplicates
 */

export const WINDOW_DAYS = 365;
export const MAX_MEETINGS = 15;
export const MAX_MENTIONS = 30;

type OwnerOpts = { owner: string };

/* ============================== types ============================== */

export type EmploymentEntry = {
  accountName: string;
  position?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type RelationshipEntry = {
  /** Name of the other person. */
  otherName: string;
  /** What the other person is to THIS person (e.g. "spouse", "manager"). */
  relation: string;
};

export type LearningEntry = {
  learnedOn?: string | null;
  text: string;
  prayer?: string | null;
};

export type MentionGroup = {
  /** Activity/meeting header, e.g. "18.10.2026 10:00, Meeting: Weekly". */
  header: string;
  /** Rendered markdown of the blocks that mention the person. */
  body: string;
};

export type PersonContext = {
  name: string;
  howToSay?: string | null;
  birthday?: string | null;
  employments: EmploymentEntry[];
  relationships: RelationshipEntry[];
  learnings: LearningEntry[];
  /** Each entry is one meeting's assembled markdown (headings level 1+). */
  meetings: string[];
  mentions: MentionGroup[];
};

/* ============================ rendering ============================ */

/** True when there is anything beyond static facts worth summarising. */
export const hasActivity = (ctx: PersonContext): boolean =>
  ctx.learnings.length > 0 ||
  ctx.meetings.length > 0 ||
  ctx.mentions.length > 0;

const renderEmployment = (e: EmploymentEntry): string => {
  const role = e.position?.trim() ? `${e.position.trim()} at ` : "";
  const range =
    e.startDate || e.endDate
      ? ` (${e.startDate ?? "?"} to ${e.endDate ?? "today"})`
      : "";
  return `- ${role}${e.accountName}${range}`;
};

const renderLearning = (l: LearningEntry): string => {
  const date = l.learnedOn ? `${l.learnedOn}: ` : "";
  const prayer = l.prayer ? ` (prayer: ${l.prayer})` : "";
  return `- ${date}${l.text.replace(/\s*\n+\s*/g, " ").trim()}${prayer}`;
};

/**
 * Render the person context as Markdown. Deterministic for a given input
 * (no "today" in here) so it can be hashed to detect changes.
 */
export const renderPersonContext = (ctx: PersonContext): string => {
  const sections: string[] = [`# Person: ${ctx.name}`];

  const facts: string[] = [];
  if (ctx.howToSay) facts.push(`- Pronunciation: ${ctx.howToSay}`);
  if (ctx.birthday) facts.push(`- Birthday: ${ctx.birthday}`);
  if (facts.length) sections.push(facts.join("\n"));

  if (ctx.employments.length) {
    sections.push(
      `## Employments\n\n${ctx.employments.map(renderEmployment).join("\n")}`
    );
  }
  if (ctx.relationships.length) {
    sections.push(
      `## Relationships\n\n${ctx.relationships
        .map((r) => `- ${r.otherName} is their ${r.relation}`)
        .join("\n")}`
    );
  }
  if (ctx.learnings.length) {
    sections.push(
      `## Learnings about them\n\n${ctx.learnings.map(renderLearning).join("\n")}`
    );
  }
  if (ctx.meetings.length) {
    sections.push(
      `## Recent meetings with them (newest first)\n\n${ctx.meetings
        .map((m) => bumpHeadings(m.trim(), 2))
        .join("\n\n")}`
    );
  }
  if (ctx.mentions.length) {
    sections.push(
      `## Recent notes mentioning them (newest first)\n\n${ctx.mentions
        .map((g) => `### ${g.header}\n\n${bumpHeadings(g.body.trim(), 2)}`)
        .join("\n\n")}`
    );
  }
  return sections.join("\n\n");
};

/** Stable change marker for the rendered context. */
export const hashContext = (markdown: string): string =>
  createHash("sha256").update(markdown).digest("hex");

/* ========================= relationship names ========================= */

const OPPOSITE: Record<string, string> = {
  parent: "child",
  child: "parent",
  manager: "employer",
  employer: "manager",
};

/**
 * A PersonRelationship row (personId=A, relatedPersonId=B, typeName=T) means
 * "B is A's T" (see helpers/person/relationships.ts). Seen from B, A is B's
 * opposite(T).
 */
export const relationFor = (
  direction: "from" | "to",
  typeName: string | null | undefined
): string => {
  if (!typeName) return "contact";
  return direction === "from" ? typeName : (OPPOSITE[typeName] ?? typeName);
};

/* ============================== loading ============================== */

const ddb = new DynamoDBClient({});

const tableName = (model: string): string => {
  const key = `DDB_TABLE_${model.toUpperCase()}`;
  const name = process.env[key];
  if (!name) throw new Error(`Missing env ${key}`);
  return name;
};

/**
 * Newest-first query on a GSI with a `createdAt` sort key, limited to rows
 * created on/after `sinceIso`, owner-filtered, stopping after `limit` rows.
 */
const queryRecent = async <T extends DdbRecord>(
  model: string,
  indexName: string,
  keyField: string,
  keyValue: string,
  sinceIso: string,
  limit: number,
  { owner }: OwnerOpts
): Promise<T[]> => {
  const items: T[] = [];
  let ExclusiveStartKey: Record<string, AttributeValue> | undefined;
  do {
    const res = await ddb.send(
      new QueryCommand({
        TableName: tableName(model),
        IndexName: indexName,
        KeyConditionExpression: "#k = :v AND #s >= :since",
        FilterExpression: "#o = :owner",
        ExpressionAttributeNames: {
          "#k": keyField,
          "#s": "createdAt",
          "#o": "owner",
        },
        ExpressionAttributeValues: {
          ":v": { S: keyValue },
          ":since": { S: sinceIso },
          ":owner": { S: owner },
        },
        ScanIndexForward: false,
        ExclusiveStartKey,
      })
    );
    for (const item of res.Items ?? []) {
      items.push(unmarshall(item) as T);
      if (items.length >= limit) return items;
    }
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
};

const textOf = (json: unknown): string => {
  if (!json) return "";
  try {
    return getMarkdown(json as JSONContent | string).trim();
  } catch (error) {
    console.warn("[person-context] could not render learning", { error });
    return "";
  }
};

type PersonRow = DdbRecord & {
  id: string;
  name?: string;
  howToSay?: string | null;
  birthday?: string | null;
  personSummarySource?: string | null;
};

const loadEmployments = async (
  personId: string,
  opts: OwnerOpts
): Promise<EmploymentEntry[]> => {
  const rows = await queryByIndex<
    DdbRecord & {
      accountId?: string;
      position?: string | null;
      startDate?: string | null;
      endDate?: string | null;
    }
  >("PersonAccount", "gsi-Person.accounts", "personId", personId, opts);
  const accounts = await batchGetItems<DdbRecord & { name?: string }>(
    "Account",
    rows.map((r) => r.accountId ?? ""),
    opts
  );
  return rows
    .map((r) => ({
      accountName: accounts.get(r.accountId ?? "")?.name ?? "",
      position: r.position,
      startDate: r.startDate,
      endDate: r.endDate,
    }))
    .filter((e) => !!e.accountName)
    .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""));
};

const loadRelationships = async (
  personId: string,
  opts: OwnerOpts
): Promise<RelationshipEntry[]> => {
  type Rel = DdbRecord & {
    personId?: string;
    relatedPersonId?: string;
    typeName?: string | null;
    endDate?: string | null;
  };
  const [from, to] = await Promise.all([
    queryByIndex<Rel>(
      "PersonRelationship",
      "gsi-Person.relationshipsFrom",
      "personId",
      personId,
      opts
    ),
    queryByIndex<Rel>(
      "PersonRelationship",
      "gsi-Person.relationshipsTo",
      "relatedPersonId",
      personId,
      opts
    ),
  ]);
  const entries = [
    ...from.map((r) => ({
      otherId: r.relatedPersonId,
      relation: relationFor("from", r.typeName),
      ended: !!r.endDate,
    })),
    ...to.map((r) => ({
      otherId: r.personId,
      relation: relationFor("to", r.typeName),
      ended: !!r.endDate,
    })),
  ].filter((e): e is typeof e & { otherId: string } => !!e.otherId);
  const people = await batchGetItems<DdbRecord & { name?: string }>(
    "Person",
    entries.map((e) => e.otherId),
    opts
  );
  return entries
    .map((e) => ({
      otherName: people.get(e.otherId)?.name ?? "",
      relation: e.ended ? `former ${e.relation}` : e.relation,
    }))
    .filter((e) => !!e.otherName);
};

const loadLearnings = async (
  personId: string,
  opts: OwnerOpts
): Promise<LearningEntry[]> => {
  const rows = await queryByIndex<
    DdbRecord & {
      learning?: unknown;
      learnedOn?: string | null;
      status?: string;
      prayer?: string | null;
      createdAt?: string;
    }
  >("PersonLearning", "gsi-Person.learnings", "personId", personId, opts);
  return rows
    .filter((r) => r.status !== "archived")
    .sort((a, b) =>
      (b.learnedOn ?? b.createdAt ?? "").localeCompare(
        a.learnedOn ?? a.createdAt ?? ""
      )
    )
    .map((r) => ({
      learnedOn: r.learnedOn,
      text: textOf(r.learning),
      prayer: r.prayer && r.prayer !== "NONE" ? r.prayer : null,
    }))
    .filter((l) => !!l.text);
};

const loadMeetings = async (
  personId: string,
  sinceIso: string,
  opts: OwnerOpts
): Promise<{ markdown: string[]; meetingIds: Set<string> }> => {
  const rows = await queryRecent<DdbRecord & { meetingId?: string }>(
    "MeetingParticipant",
    "meetingParticipantsByPersonIdAndCreatedAt",
    "personId",
    personId,
    sinceIso,
    MAX_MEETINGS,
    opts
  );
  const meetingIds = [
    ...new Set(rows.map((r) => r.meetingId).filter((id): id is string => !!id)),
  ];
  const markdown = await Promise.all(
    meetingIds.map((id) =>
      assembleMeetingFromCache(id, opts).catch((error) => {
        console.warn(`[person-context] meeting ${id} failed; skipping`, {
          error,
        });
        return "";
      })
    )
  );
  return {
    markdown: markdown.filter((m) => !!m.trim()),
    meetingIds: new Set(meetingIds),
  };
};

const loadMentions = async (
  personId: string,
  sinceIso: string,
  skipMeetingIds: Set<string>,
  opts: OwnerOpts
): Promise<MentionGroup[]> => {
  const rows = await queryRecent<DdbRecord & { noteBlockId?: string }>(
    "NoteBlockPerson",
    "noteBlockPeopleByPersonIdAndCreatedAt",
    "personId",
    personId,
    sinceIso,
    MAX_MENTIONS,
    opts
  );
  const blockIds = [
    ...new Set(
      rows.map((r) => r.noteBlockId).filter((id): id is string => !!id)
    ),
  ];
  if (!blockIds.length) return [];

  // fetchBlocks resolves taskItem todos too; missing (dangling) ids drop out.
  const blocks = await fetchBlocks(
    { id: "mentions", noteBlockIds: blockIds },
    opts
  );
  const activityIds = [
    ...new Set(
      blocks
        .map((b) => b.activityId as string | undefined)
        .filter((id): id is string => !!id)
    ),
  ];
  const activities = await batchGetItems<
    DdbRecord & {
      meetingActivitiesId?: string | null;
      activityHeaderMarkdown?: string | null;
    }
  >("Activity", activityIds, opts);
  const meetingIds = [
    ...new Set(
      [...activities.values()]
        .map((a) => a.meetingActivitiesId)
        .filter((id): id is string => !!id)
    ),
  ];
  const meetings = await batchGetItems<
    DdbRecord & { meetingHeaderMarkdown?: string | null }
  >("Meeting", meetingIds, opts);

  // Group blocks by activity, keeping the newest-mention-first order.
  const groups = new Map<string, typeof blocks>();
  for (const block of blocks) {
    const activityId = block.activityId as string | undefined;
    if (!activityId) continue;
    const activity = activities.get(activityId);
    if (!activity) continue;
    if (
      activity.meetingActivitiesId &&
      skipMeetingIds.has(activity.meetingActivitiesId)
    ) {
      continue; // already part of an included meeting
    }
    groups.set(activityId, [...(groups.get(activityId) ?? []), block]);
  }

  const result: MentionGroup[] = [];
  for (const [activityId, groupBlocks] of groups) {
    const activity = activities.get(activityId)!;
    const header =
      (activity.meetingActivitiesId
        ? meetings.get(activity.meetingActivitiesId)?.meetingHeaderMarkdown
        : activity.activityHeaderMarkdown
      )?.trim() || "Note";
    const body = renderBlocks(groupBlocks);
    if (body) result.push({ header: header.split("\n")[0], body });
  }
  return result;
};

export type LoadedPerson = {
  owner: string;
  personSummarySource?: string | null;
  context: PersonContext;
};

/** Load the person and their full context. Null when missing/ownerless. */
export const loadPersonContext = async (
  personId: string,
  now = new Date()
): Promise<LoadedPerson | null> => {
  const person = await getItemRaw<PersonRow>("Person", personId);
  if (!person?.owner || !person.name?.trim()) return null;
  const opts = { owner: person.owner };
  const sinceIso = new Date(
    now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const [employments, relationships, learnings, meetings] = await Promise.all([
    loadEmployments(personId, opts),
    loadRelationships(personId, opts),
    loadLearnings(personId, opts),
    loadMeetings(personId, sinceIso, opts),
  ]);
  const mentions = await loadMentions(
    personId,
    sinceIso,
    meetings.meetingIds,
    opts
  );

  return {
    owner: person.owner,
    personSummarySource: person.personSummarySource,
    context: {
      name: person.name.trim(),
      howToSay: person.howToSay,
      birthday: person.birthday,
      employments,
      relationships,
      learnings,
      meetings: meetings.markdown,
      mentions,
    },
  };
};
