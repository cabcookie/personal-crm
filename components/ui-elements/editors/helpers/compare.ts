import { isNil, omitBy } from "lodash";
import { flow, isEqual } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";

const cleanAttrs = (attrs: EditorJsonContent["attrs"]): EditorJsonContent => {
  if (!attrs) return {};
  const cleanedAttrs = omitBy(attrs, isNil);
  return Object.keys(cleanedAttrs).length === 0 ? {} : { attrs: cleanedAttrs };
};

const cleanContent = ({
  attrs,
  content,
  ...rest
}: EditorJsonContent): EditorJsonContent => ({
  ...rest,
  ...cleanAttrs(attrs),
  ...(!content
    ? {}
    : {
        content: content.map(cleanContent),
      }),
});

export const isUpToDate = (
  notes: EditorJsonContent,
  editorJson: EditorJsonContent | undefined
) =>
  !editorJson
    ? false
    : flow(cleanContent, flow(cleanContent, isEqual)(notes))(editorJson);
