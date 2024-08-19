import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { flow } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { transformNotesVersion1 } from "./transform-v1";
import { transformNotesVersion2 } from "./transform-v2";
import { transformNotesVersion3 } from "./transform-v3";

interface TransformNotesVersionType {
  formatVersion: ActivityData["formatVersion"];
  notes: ActivityData["notes"];
  notesJson: ActivityData["notesJson"];
  noteBlockIds: ActivityData["noteBlockIds"];
  noteBlocks: NoteBlockData[];
  forProjects: ActivityData["forProjects"];
}

const createDocument = ({
  formatVersion,
  noteBlockIds,
  noteBlocks,
  notes,
  notesJson,
}: Omit<TransformNotesVersionType, "forProjects">): EditorJsonContent =>
  formatVersion === 3
    ? transformNotesVersion3(noteBlocks, noteBlockIds)
    : formatVersion === 2
    ? transformNotesVersion2(notesJson)
    : transformNotesVersion1(notes);

const createAttrs = (
  content: EditorJsonContent,
  level: number
): Record<string, never> | { attrs: EditorJsonContent["attrs"] } => {
  const attrs = {
    ...content.attrs,
    ...(content.type &&
    level === 1 &&
    !["bulletList", "taskList"].includes(content.type) &&
    !content.attrs?.blockId
      ? { blockId: null }
      : {}),
    ...(content.type === "listItem" && level === 2 && !content.attrs?.blockId
      ? { blockId: null }
      : {}),
    ...(content.type === "taskItem" && level === 2 && !content.attrs?.todoId
      ? { todoId: null }
      : {}),
    ...(content.type === "taskItem" && level === 2 && !content.attrs?.blockId
      ? { blockId: null }
      : {}),
    ...(content.type === "mention" && !content.attrs?.recordId
      ? { recordId: null }
      : {}),
  };
  return Object.keys(attrs).length === 0 ? {} : { attrs };
};

const infuseTempBlockAndOtherIds =
  (level: number) =>
  (content: EditorJsonContent): EditorJsonContent => {
    return {
      ...content,
      ...createAttrs(content, level),
      ...(!content.content
        ? {}
        : {
            content: content.content.map(infuseTempBlockAndOtherIds(level + 1)),
          }),
    };
  };

const infuseRootLevelTempBlockAndOtherIds =
  (projects: ActivityData["forProjects"]) => (content: EditorJsonContent) => ({
    ...content,
    attrs: {
      projects,
    },
    content: content.content?.map(infuseTempBlockAndOtherIds(1)),
  });

export const transformNotesVersion = ({
  forProjects,
  ...activity
}: TransformNotesVersionType): EditorJsonContent =>
  flow(
    createDocument,
    infuseRootLevelTempBlockAndOtherIds(forProjects)
  )(activity);
