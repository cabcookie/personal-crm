import type { JSONContent } from "@tiptap/core";
import { getMarkdown } from "./markdown";

const INDENT = "  ";
const LIST_CONTAINER_TYPES = new Set([
  "bulletList",
  "orderedList",
  "taskList",
]);

const renderParagraphInline = (paragraph: JSONContent | undefined): string => {
  if (!paragraph?.content) return "";
  return paragraph.content.map(getMarkdown).join("").trimEnd();
};

export const renderListItemNode = (
  item: JSONContent,
  indent: number,
  marker: string,
  checked?: boolean
): string => {
  const prefix = `${INDENT.repeat(indent)}${marker} `;
  const checkbox = checked === undefined ? "" : `[${checked ? "x" : " "}] `;
  const lines: string[] = [];
  let headWritten = false;
  for (const child of item.content ?? []) {
    if (child.type === "paragraph") {
      const text = renderParagraphInline(child);
      if (!headWritten) {
        lines.push(`${prefix}${checkbox}${text}`);
        headWritten = true;
      } else if (text) {
        lines.push(`${INDENT.repeat(indent + 1)}${text}`);
      }
    } else if (child.type && LIST_CONTAINER_TYPES.has(child.type)) {
      if (!headWritten) {
        lines.push(`${prefix}${checkbox}`.trimEnd());
        headWritten = true;
      }
      const nested = renderListContainer(child, indent + 1);
      if (nested) lines.push(nested);
    } else {
      const fallback = getMarkdown(child).trimEnd();
      if (!headWritten) {
        lines.push(`${prefix}${checkbox}${fallback}`);
        headWritten = true;
      } else if (fallback) {
        lines.push(
          fallback
            .split("\n")
            .map((l) => `${INDENT.repeat(indent + 1)}${l}`)
            .join("\n")
        );
      }
    }
  }
  if (!headWritten) lines.push(`${prefix}${checkbox}`.trimEnd());
  return lines.join("\n");
};

export const renderListContainer = (
  container: JSONContent,
  indent: number
): string => {
  const items = container.content ?? [];
  const startAt = (container.attrs?.start as number | undefined) ?? 1;
  const lines: string[] = [];
  items.forEach((item, i) => {
    let marker: string;
    let checked: boolean | undefined;
    if (container.type === "orderedList") marker = `${startAt + i}.`;
    else if (container.type === "taskList" || item.type === "taskItem") {
      marker = "-";
      checked = item.attrs?.checked === true;
    } else marker = "-";
    lines.push(renderListItemNode(item, indent, marker, checked));
  });
  return lines.join("\n");
};

/**
 * Render a full TipTap document (doc node or a single standalone node) to
 * markdown. Lists use real nested indentation and tight spacing; paragraphs
 * that render to only whitespace (NBSP-only paragraphs from pasted HTML) are
 * dropped; triple-or-more newlines are collapsed to one blank line.
 */
export const renderDoc = (
  doc: JSONContent | string | null | undefined
): string => {
  if (!doc) return "";
  const node: JSONContent =
    typeof doc === "string" ? (JSON.parse(doc) as JSONContent) : doc;
  if (!node) return "";
  const children: JSONContent[] =
    node.type === "doc" ? (node.content ?? []) : [node];
  const parts: string[] = [];
  for (const child of children) {
    if (child.type && LIST_CONTAINER_TYPES.has(child.type)) {
      const rendered = renderListContainer(child, 0);
      if (rendered) parts.push(rendered + "\n\n");
    } else {
      const rendered = getMarkdown(child);
      if (rendered.trim()) parts.push(rendered);
    }
  }
  return parts.join("").replace(/\n{3,}/g, "\n\n").trim();
};

/**
 * Shift every markdown heading line deeper by `by` hashes. Used to re-depth
 * rendered editor content when it is embedded under a specific section level.
 * Does not cap at 6 — markdown H7+ is valid in the export format we target.
 */
export const bumpHeadings = (md: string, by = 1): string => {
  if (!by || by <= 0) return md;
  return md.replace(
    /^(#+) /gm,
    (_, hashes: string) => "#".repeat(hashes.length + by) + " "
  );
};
