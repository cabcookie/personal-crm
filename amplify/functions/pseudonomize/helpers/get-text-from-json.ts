export const getTextFromJson = (json: string | undefined, type?: string) => {
  if (!json) return "";
  const content = JSON.parse(json);
  if (typeof content === "string") return content;
  const jsonContent = content as JSONContent;
  return `${type === "heading" ? getHeading(jsonContent) : type === "listItem" ? "- " : ""}${jsonContent.content?.map(mapJsonContent).join("") ?? ""}`;
};

const getHeading = (content: JSONContent) =>
  `${"#".repeat(content.attrs?.level ?? 1)} `;

const mapJsonContent = (content: JSONContent): string => {
  if (content.type === "text") return content.text ?? "";
  if (content.type === "heading")
    return `${"#".repeat(content.attrs?.level ?? 1)} ${content.content?.map(mapJsonContent).join("")}`;
  if (content.type === "listItem")
    return `- ${content.content?.map(mapJsonContent).join("")}`;
  return content.content?.map(mapJsonContent).join("") || "";
};

type JSONContent = {
  content?: JSONContent[];
  text?: string;
  type?: string;
  attrs?: {
    level?: number;
  };
};
