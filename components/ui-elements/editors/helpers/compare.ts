import { JSONContent } from "@tiptap/core";
import { isNil } from "lodash";
import { flow, identity, isEqual, omit, omitBy } from "lodash/fp";
import { LIST_TYPES } from "./blocks";

const omitBlockId = (level: number, type: JSONContent["type"]) =>
  type &&
  (level === 1 ||
    (level === 2 && LIST_TYPES.includes(type)) ||
    (level === 3 && !["listItem", "taskItem"].includes(type)) ||
    level > 3)
    ? omit("blockId")
    : identity;

const cleanAttrs = (
  level: number,
  type: JSONContent["type"],
  attrs: JSONContent["attrs"]
): JSONContent => {
  if (!attrs) return {};
  const cleanedAttrs = flow(omitBy(isNil), omitBlockId(level, type))(attrs);
  if (!cleanedAttrs) return {};
  return Object.keys(cleanedAttrs).length === 0 ? {} : { attrs: cleanedAttrs };
};

const cleanContent =
  (level: number = 1) =>
  ({ attrs, content, ...rest }: JSONContent): JSONContent => ({
    ...rest,
    ...cleanAttrs(level, rest.type, attrs),
    ...(!content
      ? {}
      : {
          content: content.map(cleanContent(level + 1)),
        }),
  });

export const isUpToDate = (
  notes: JSONContent,
  editorJson: JSONContent | undefined
) =>
  !editorJson
    ? false
    : flow(cleanContent(), flow(cleanContent(), isEqual)(notes))(editorJson);
