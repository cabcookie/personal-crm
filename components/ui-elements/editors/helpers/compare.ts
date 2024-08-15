import { isNil, omitBy } from "lodash";
import { flow, isEqual } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";

const cleanAttrs = (
  attrs: EditorJsonContent["attrs"]
): EditorJsonContent["attrs"] => {
  if (!attrs) return undefined;
  const cleanedAttrs = omitBy(attrs, isNil);
  return Object.keys(cleanedAttrs).length > 0 ? cleanedAttrs : undefined;
};

const cleanContent = ({
  attrs,
  content,
  ...rest
}: EditorJsonContent): EditorJsonContent => ({
  ...rest,
  attrs: cleanAttrs(attrs),
  content: content?.map(cleanContent),
});

export const isUpToDate = (
  notes: EditorJsonContent,
  editorJson: EditorJsonContent | undefined
) =>
  !editorJson
    ? false
    : flow(cleanContent, flow(cleanContent, isEqual)(notes))(editorJson);
