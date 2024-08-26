import { JSONContent } from "@tiptap/core";
import { isNil, omitBy } from "lodash";
import { flow, isEqual } from "lodash/fp";

const cleanAttrs = (attrs: JSONContent["attrs"]): JSONContent => {
  if (!attrs) return {};
  const cleanedAttrs = omitBy(attrs, isNil);
  return Object.keys(cleanedAttrs).length === 0 ? {} : { attrs: cleanedAttrs };
};

const cleanContent = ({
  attrs,
  content,
  ...rest
}: JSONContent): JSONContent => ({
  ...rest,
  ...cleanAttrs(attrs),
  ...(!content
    ? {}
    : {
        content: content.map(cleanContent),
      }),
});

export const isUpToDate = (
  notes: JSONContent,
  editorJson: JSONContent | undefined
) =>
  !editorJson
    ? false
    : flow(cleanContent, flow(cleanContent, isEqual)(notes))(editorJson);
