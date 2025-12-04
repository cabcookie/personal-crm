import { JSONContent } from "@tiptap/core";

export const contentTypes = new Set<string>();

export const getMarkdown = (json: JSONContent | string): string => {
  const content =
    typeof json === "string" ? (JSON.parse(json) as JSONContent) : json;

  if (!content.type) return "";

  if (content.type === "text")
    return `${content.text || ""}${getContent(content)}`;

  if (content.type === "paragraph") return `${getContent(content)}\n\n`;

  if (content.type === "taskItem")
    return `- [${content.attrs?.checked ? "x" : " "}] ${getContent(content)}`;

  if (["listItem", "listItemOrdered"].includes(content.type))
    return `- ${getContent(content)}`;

  if (content.type === "s3image") return "";

  if (content.type === "mention") return content.attrs?.label || "";

  if (content.type === "hardBreak") return "\n";

  if (content.type === "blockquote")
    return `> ${getContent(content).split("\n\n").join("\n> ")}\n`;

  if (content.type === "heading")
    return `${"#".repeat((content.attrs?.level || 0) + 3)} ${getContent(content)}\n\n`;

  if (content.type) contentTypes.add(content.type);
  return `${getContent(content)}\n`;
};

const getContent = (content: JSONContent): string =>
  !content.content ? "" : content.content.map(getMarkdown).join("");
