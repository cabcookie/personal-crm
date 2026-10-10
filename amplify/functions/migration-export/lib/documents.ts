import type { Doc, JsonNode, Warning } from "./types";

/**
 * Turns the three Personal CRM note formats into the normalized TipTap
 * document of the migration export (see docs/migration-export-format.md,
 * section "Documents"). Pure functions — no I/O.
 */

export type BlockRecord = {
  id: string;
  type?: string | null;
  content?: unknown;
  todoId?: string | null;
};

export type TodoRecord = {
  id: string;
  todo?: unknown;
  status?: string | null;
  doneOn?: string | null;
};

/** Where a document comes from, for warnings. */
export type DocSource = {
  entity: string;
  id: string;
  warnings: Warning[];
};

const KNOWN_NODE_TYPES = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "image",
  "mention",
  "text",
]);

const EDITOR_ATTRS = new Set([
  "blockId",
  "recordId",
  "src",
  "expiresAt",
  "fileKey",
]);

const LIST_WRAPPERS: Record<string, string> = {
  listItem: "bulletList",
  listItemOrdered: "orderedList",
  taskItem: "taskList",
};

export const emptyDoc = (): Doc => ({ type: "doc", content: [] });

/** AWSJSON fields arrive from DynamoDB as strings; tolerate both shapes. */
export const parseJson = (
  value: unknown,
  source: DocSource
): JsonNode | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return value as JsonNode;
  try {
    return JSON.parse(value) as JsonNode;
  } catch (error) {
    source.warnings.push({
      code: "UNPARSEABLE_CONTENT",
      entity: source.entity,
      id: source.id,
      detail: String(error),
    });
    return null;
  }
};

export const textToDoc = (text: string | null | undefined): Doc => ({
  type: "doc",
  content: (text ?? "")
    .split("\n")
    .map((line) =>
      !line
        ? { type: "paragraph" }
        : { type: "paragraph", content: [{ type: "text", text: line }] }
    ),
});

const cleanAttrs = (
  attrs: Record<string, unknown> | undefined
): Record<string, unknown> | undefined => {
  if (!attrs) return undefined;
  const entries = Object.entries(attrs).filter(
    ([key, value]) =>
      !EDITOR_ATTRS.has(key) && value !== null && value !== undefined
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
};

const withAttrs = (
  node: JsonNode,
  attrs: Record<string, unknown> | undefined
): JsonNode => {
  const { attrs: _drop, ...rest } = node;
  return attrs ? { ...rest, attrs } : rest;
};

/** Removes editor-internal attributes, renames s3image, reports unknown types. */
export const cleanNode = (node: JsonNode, source: DocSource): JsonNode => {
  if (node.type === "s3image") {
    return {
      type: "image",
      attrs: { fileHash: null, s3Key: node.attrs?.s3Key ?? null },
    };
  }
  if (node.type && !KNOWN_NODE_TYPES.has(node.type)) {
    source.warnings.push({
      code: "UNKNOWN_NODE_TYPE",
      entity: source.entity,
      id: source.id,
      detail: node.type,
    });
    return node;
  }
  const cleaned = withAttrs(
    node,
    node.type === "doc" ? undefined : cleanAttrs(node.attrs)
  );
  if (node.type === "mention") {
    cleaned.attrs = {
      id: node.attrs?.id ?? null,
      label: node.attrs?.label ?? null,
    };
  }
  if (node.type === "taskItem") {
    cleaned.attrs = {
      ...cleaned.attrs,
      todoId: node.attrs?.todoId ?? null,
      checked: node.attrs?.checked === true,
      doneOn: node.attrs?.doneOn ?? null,
    };
  }
  if (node.marks) {
    cleaned.marks = node.marks.map((mark) =>
      mark.attrs ? withAttrsMark(mark) : mark
    );
  }
  if (node.content) {
    cleaned.content = node.content.map((child) => cleanNode(child, source));
  }
  return cleaned;
};

const withAttrsMark = (mark: {
  type: string;
  attrs?: Record<string, unknown>;
}) => {
  const attrs = cleanAttrs(mark.attrs);
  return attrs ? { type: mark.type, attrs } : { type: mark.type };
};

const toDoc = (node: JsonNode | null): Doc =>
  !node
    ? emptyDoc()
    : node.type === "doc"
      ? { type: "doc", content: node.content ?? [] }
      : { type: "doc", content: [node] };

export const cleanDoc = (node: JsonNode | null, source: DocSource): Doc => {
  const doc = toDoc(node);
  return {
    type: "doc",
    content: doc.content.map((child) => cleanNode(child, source)),
  };
};

/** A parsed TipTap JSON field (v2 notes, learnings, account introduction). */
export const jsonFieldToDoc = (value: unknown, source: DocSource): Doc =>
  cleanDoc(parseJson(value, source), source);

const todoToTaskItem = (
  todo: TodoRecord,
  source: DocSource
): JsonNode | null => {
  const content = parseJson(todo.todo, source);
  if (!content) return null;
  return {
    ...content,
    type: "taskItem",
    attrs: {
      ...content.attrs,
      todoId: todo.id,
      checked: todo.status === "DONE",
      doneOn: todo.doneOn ?? null,
    },
  };
};

const appendListItem = (
  nodes: JsonNode[],
  wrapperType: string,
  item: JsonNode
): JsonNode[] => {
  const last = nodes[nodes.length - 1];
  if (last?.type === wrapperType) {
    last.content = [...(last.content ?? []), item];
    return nodes;
  }
  return [
    ...nodes,
    {
      type: wrapperType,
      ...(wrapperType === "orderedList" ? { attrs: { start: 1 } } : {}),
      content: [item],
    },
  ];
};

/**
 * Format v3: blocks in `noteBlockIds` order; list blocks are wrapped into their
 * list container like components/ui-elements/editors/helpers/transform-v3.ts.
 */
export const blocksToDoc = (
  noteBlockIds: string[],
  blocks: BlockRecord[],
  todos: TodoRecord[],
  source: DocSource
): Doc => {
  const blockById = new Map(blocks.map((b) => [b.id, b]));
  const todoById = new Map(todos.map((t) => [t.id, t]));
  let nodes: JsonNode[] = [];
  for (const blockId of noteBlockIds) {
    const block = blockById.get(blockId);
    if (!block) continue;
    if (block.type === "taskItem") {
      const todo = block.todoId ? todoById.get(block.todoId) : undefined;
      const item = todo ? todoToTaskItem(todo, source) : null;
      if (item) nodes = appendListItem(nodes, "taskList", item);
      continue;
    }
    const content = parseJson(block.content, source);
    if (!content) continue;
    const wrapper = content.type ? LIST_WRAPPERS[content.type] : undefined;
    if (wrapper) {
      const item =
        content.type === "listItemOrdered"
          ? { ...content, type: "listItem" }
          : content;
      nodes = appendListItem(nodes, wrapper, item);
    } else {
      nodes = [...nodes, content];
    }
  }
  return cleanDoc({ type: "doc", content: nodes }, source);
};

const walk = (node: JsonNode, visit: (n: JsonNode) => void): void => {
  visit(node);
  node.content?.forEach((child) => walk(child, visit));
};

const distinct = (values: (string | null | undefined)[]): string[] => [
  ...new Set(values.filter((v): v is string => !!v)),
];

export const collectMentionIds = (doc: Doc): string[] => {
  const ids: (string | undefined)[] = [];
  doc.content.forEach((n) =>
    walk(n, (node) => {
      if (node.type === "mention") ids.push(node.attrs?.id as string);
    })
  );
  return distinct(ids);
};

export const collectS3Keys = (doc: Doc): string[] => {
  const keys: (string | undefined)[] = [];
  doc.content.forEach((n) =>
    walk(n, (node) => {
      if (node.type === "image") keys.push(node.attrs?.s3Key as string);
    })
  );
  return distinct(keys);
};

/** Fills `image.attrs.fileHash` once the files have been downloaded. */
export const applyFileHashes = (
  doc: Doc,
  hashByKey: Map<string, string | null>
): void =>
  doc.content.forEach((n) =>
    walk(n, (node) => {
      if (node.type !== "image" || !node.attrs) return;
      node.attrs.fileHash = hashByKey.get(node.attrs.s3Key as string) ?? null;
    })
  );
