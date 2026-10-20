import { randomUUID } from "crypto";
import {
  putItem,
  updateItemAttributes,
} from "../../project-summary/lib/ddb-write";
import type { TopicActivity } from "./load-meeting-context";

/**
 * Transfers a finished meeting summary into each topic's Activity notes, as
 * real v3 NoteBlocks (plus Todo + NoteBlockPerson side records), appended to
 * whatever notes the Activity already has. Runs server-side (from the
 * summarize-meeting Lambda) right after the summary is produced.
 *
 * It replicates the client editor's storage invariants (see the
 * "activity-block-writes" notes): v3 Activity, discrete NoteBlock rows, the
 * noteBlockIds ordering array as the source of truth, taskItem blocks with
 * content=null + a linked Todo holding the rich text, inline @mention nodes
 * backed by NoteBlockPerson junction rows. content/todo are written as native
 * maps (the same shape Amplify stores a.json() in); readers tolerate that.
 */

type Person = { name?: string; id?: string };
type Item = { text?: string; people?: Person[] };
type TaskItem = Item & { owner?: Person | null };
export type TopicSummary = {
  projectId?: string;
  projectName?: string;
  accomplishments?: Item[];
  newTasks?: TaskItem[];
  blockers?: Item[];
};
export type MeetingSummary = { topics?: TopicSummary[] };

type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: { type: string }[];
};

const now = () => new Date().toISOString();

/** A bare text run. */
const textNode = (text: string): TipTapNode => ({ type: "text", text });

/** An inline @mention node (attrs mirror the editor: id = Person.id, label). */
const mentionNode = (person: Person): TipTapNode => ({
  type: "mention",
  attrs: { id: person.id, label: person.name },
});

/**
 * Build the inline content of a line: an optional leading "owner: " (owner as
 * a mention when it has an id, else bold text), the main text, and a trailing
 * "(@a, @b)" of any other involved people as mentions. Returns the inline
 * nodes plus the distinct set of people that became real mention nodes (so the
 * caller can create matching NoteBlockPerson rows).
 */
const buildInline = (
  text: string,
  owner?: Person | null,
  people?: Person[]
): { nodes: TipTapNode[]; mentioned: Person[] } => {
  const nodes: TipTapNode[] = [];
  const mentioned: Person[] = [];

  if (owner && owner.name) {
    if (owner.id) {
      nodes.push(mentionNode(owner));
      mentioned.push(owner);
      nodes.push(textNode(": "));
    } else {
      nodes.push({
        type: "text",
        text: `${owner.name}: `,
        marks: [{ type: "bold" }],
      });
    }
  }

  nodes.push(textNode(text));

  const others = (people ?? []).filter(
    (p) => p && p.id && p.name && p.id !== owner?.id
  );
  if (others.length) {
    nodes.push(textNode(" ("));
    others.forEach((p, i) => {
      if (i > 0) nodes.push(textNode(", "));
      nodes.push(mentionNode(p));
      mentioned.push(p);
    });
    nodes.push(textNode(")"));
  }

  return { nodes, mentioned };
};

type OwnerOpts = { owner: string };

type PendingBlock = {
  id: string;
  record: Record<string, unknown>;
  todo?: Record<string, unknown>;
  mentioned: Person[];
};

/** A heading NoteBlock (editor H1 -> attrs.level 1). */
const headingBlock = (
  activityId: string,
  owner: string,
  title: string
): PendingBlock => {
  const id = randomUUID();
  return {
    id,
    mentioned: [],
    record: {
      id,
      __typename: "NoteBlock",
      owner,
      activityId,
      type: "heading",
      formatVersion: 3,
      content: {
        type: "heading",
        attrs: { level: 3 },
        content: [textNode(title)],
      },
      createdAt: now(),
      updatedAt: now(),
    },
  };
};

/** A bullet list item NoteBlock. */
const bulletBlock = (
  activityId: string,
  owner: string,
  item: Item
): PendingBlock => {
  const id = randomUUID();
  const { nodes, mentioned } = buildInline(item.text ?? "", null, item.people);
  return {
    id,
    mentioned,
    record: {
      id,
      __typename: "NoteBlock",
      owner,
      activityId,
      type: "listItem",
      formatVersion: 3,
      content: {
        type: "listItem",
        content: [{ type: "paragraph", content: nodes }],
      },
      createdAt: now(),
      updatedAt: now(),
    },
  };
};

/**
 * A taskItem NoteBlock (content=null) plus its linked Todo holding the rich
 * text "<owner>: <task> (others)". Todo must be created before the NoteBlock
 * (FK), so both records are returned for the caller to write in order.
 */
const taskBlock = (
  activityId: string,
  owner: string,
  task: TaskItem
): PendingBlock => {
  const todoId = randomUUID();
  const blockId = randomUUID();
  const { nodes, mentioned } = buildInline(
    task.text ?? "",
    task.owner ?? null,
    task.people
  );
  const todoNode = {
    type: "taskItem",
    content: [{ type: "paragraph", content: nodes }],
    attrs: { checked: false },
  };
  return {
    id: blockId,
    mentioned,
    todo: {
      id: todoId,
      __typename: "Todo",
      owner,
      todo: todoNode,
      status: "OPEN",
      createdAt: now(),
      updatedAt: now(),
    },
    record: {
      id: blockId,
      __typename: "NoteBlock",
      owner,
      activityId,
      type: "taskItem",
      formatVersion: 3,
      content: null,
      todoId,
      createdAt: now(),
      updatedAt: now(),
    },
  };
};

const hasItems = (a?: Item[]): a is Item[] => !!a && a.length > 0;

/**
 * Build the ordered list of blocks for one topic: an "Accomplishments"
 * heading + bullets, a "New tasks" heading + task checkboxes, a "Blockers"
 * heading + bullets. Empty sections are skipped.
 */
const buildTopicBlocks = (
  activityId: string,
  owner: string,
  topic: TopicSummary
): PendingBlock[] => {
  const blocks: PendingBlock[] = [];
  if (hasItems(topic.accomplishments)) {
    blocks.push(headingBlock(activityId, owner, "Accomplishments"));
    for (const it of topic.accomplishments)
      blocks.push(bulletBlock(activityId, owner, it));
  }
  if (hasItems(topic.newTasks)) {
    blocks.push(headingBlock(activityId, owner, "New tasks"));
    for (const t of topic.newTasks)
      blocks.push(taskBlock(activityId, owner, t));
  }
  if (hasItems(topic.blockers)) {
    blocks.push(headingBlock(activityId, owner, "Blockers"));
    for (const it of topic.blockers)
      blocks.push(bulletBlock(activityId, owner, it));
  }
  return blocks;
};

/** Persist one block (Todo first if present, then NoteBlock, then mentions). */
const writeBlock = async (
  block: PendingBlock,
  opts: OwnerOpts
): Promise<void> => {
  if (block.todo) await putItem("Todo", block.todo);
  await putItem("NoteBlock", block.record);
  // One NoteBlockPerson per distinct mentioned person in this block.
  const distinct = new Map<string, Person>();
  for (const p of block.mentioned) if (p.id) distinct.set(p.id, p);
  for (const p of distinct.values()) {
    await putItem("NoteBlockPerson", {
      id: randomUUID(),
      __typename: "NoteBlockPerson",
      owner: opts.owner,
      noteBlockId: block.id,
      personId: p.id,
      createdAt: now(),
      updatedAt: now(),
    });
  }
};

/**
 * Append the summary of each topic into its Activity's notes. For every topic
 * that maps to an Activity of this meeting and has content, create the blocks,
 * write them, and append their ids to the Activity's noteBlockIds (preserving
 * existing notes), forcing the Activity to v3.
 *
 * Best-effort per topic: a failure on one topic is logged and does not abort
 * the others. Returns the number of topics applied.
 */
export const applySummaryToActivities = async (
  summary: MeetingSummary,
  topicActivities: TopicActivity[],
  opts: OwnerOpts
): Promise<number> => {
  const byProject = new Map(topicActivities.map((t) => [t.projectId, t]));
  let applied = 0;

  for (const topic of summary.topics ?? []) {
    if (!topic.projectId) continue;
    const target = byProject.get(topic.projectId);
    if (!target) {
      console.warn(
        `[apply-summary] no Activity for topic project ${topic.projectId}; skipping`
      );
      continue;
    }
    const blocks = buildTopicBlocks(target.activityId, opts.owner, topic);
    if (!blocks.length) continue;

    try {
      for (const block of blocks) await writeBlock(block, opts);
      const newIds = [...target.noteBlockIds, ...blocks.map((b) => b.id)];
      await updateItemAttributes(
        "Activity",
        target.activityId,
        {
          noteBlockIds: newIds,
          formatVersion: 3,
          notes: undefined,
          notesJson: undefined,
        },
        opts.owner
      );
      applied += 1;
    } catch (err) {
      console.error(
        `[apply-summary] failed to apply topic ${topic.projectId} to activity ${target.activityId}`,
        err
      );
    }
  }
  return applied;
};
