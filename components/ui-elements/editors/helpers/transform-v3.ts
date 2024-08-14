import {
  ActivityData,
  fetchActivity,
  mapActivity,
  NoteBlockData,
} from "@/api/useActivity";
import { compact, flow, last, reduce, union } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";
import { createBlock, getBlocks, updateBlockIds } from "./blocks";
import { transformNotesVersion } from "./transformers";

export let tranformingActivityIds: string[] = [];

const mapListItem = (
  wrapperType: string,
  prev: EditorJsonContent[],
  content: EditorJsonContent,
  blockId: string
): EditorJsonContent[] => {
  const preparedContent: EditorJsonContent = {
    ...content,
    attrs: { ...content.attrs, blockId },
  };
  if (last(prev)?.type !== wrapperType)
    return [...prev, { type: wrapperType, content: [preparedContent] }];
  return prev.map((val, index) =>
    index !== prev.length - 1
      ? val
      : {
          ...prev[index],
          content: [...(prev[index].content ?? []), preparedContent],
        }
  );
};

const mapBlocks =
  (noteBlocks: NoteBlockData[]) =>
  (prev: EditorJsonContent[], blockId: string): EditorJsonContent[] => {
    const block = noteBlocks.find((block) => block.id === blockId);
    if (!block) return prev;
    const content: EditorJsonContent = JSON.parse(
      (block.type === "taskItem" ? block.todo.todo : block.content) as any
    );
    if (content.type === "listItem")
      return mapListItem("bulletList", prev, content, blockId);
    if (content.type === "taskItem")
      return mapListItem("taskList", prev, content, blockId);
    return [...prev, { ...content, attrs: { ...content.attrs, blockId } }];
  };

export const transformNotesVersion3 = (
  noteBlocks: NoteBlockData[],
  noteBlockIds?: string[] | null
) => ({
  type: "doc",
  content: flow(reduce(mapBlocks(noteBlocks), []), compact)(noteBlockIds) ?? [],
});

export const updateActivityToNotesVersion3 = async (activity: ActivityData) => {
  tranformingActivityIds = flow(union([activity.id]))(tranformingActivityIds);
  const blocks = flow(transformNotesVersion, getBlocks)(activity);
  if (!blocks) return mapActivity(activity);
  const resultIds = await Promise.all(blocks.map(createBlock(activity)));
  const result = await updateBlockIds(activity, resultIds);
  if (!result) return;
  const data = await fetchActivity(activity.id)();
  if (!data) return;
  tranformingActivityIds = tranformingActivityIds.filter(
    (id) => id !== data.id
  );
  return data;
};
