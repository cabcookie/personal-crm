import { JSONContent } from "@tiptap/core";

export const contentTypes = new Set<string>();

export const getMarkdown = (json: JSONContent | string): string => {
  const content =
    typeof json === "string" ? (JSON.parse(json) as JSONContent) : json;

  if (!content.type) return "";

  if (content.type === "s3image") return "";

  if (content.type === "mention") return content.attrs?.label || "";

  if (content.type === "hardBreak") return "\n";

  const subContent = getContent(content);

  if (content.type === "doc") return subContent;

  if (content.type === "text") return `${content.text || ""}${subContent}`;

  if (content.type === "paragraph")
    return !subContent ? "" : `${subContent}\n\n`;

  if (content.type === "taskItem")
    return `- [${content.attrs?.checked ? "x" : " "}] ${subContent}`;

  if (["listItem", "listItemOrdered"].includes(content.type))
    return `- ${subContent}`;

  if (content.type === "blockquote")
    return `> ${subContent.split("\n\n").join("")}\n\n`;

  if (content.type === "heading")
    return `${"#".repeat((content.attrs?.level || 0) + 2)} ${subContent}\n\n`;

  if (content.type) contentTypes.add(content.type);

  return `${subContent}\n`;
};

const getContent = (content: JSONContent): string =>
  !content.content ? "" : content.content.map(getMarkdown).join("");
