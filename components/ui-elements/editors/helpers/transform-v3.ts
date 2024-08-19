import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { compact, flow, last, reduce } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";

const mapPeople =
  (block: NoteBlockData) =>
  (content: EditorJsonContent): EditorJsonContent => ({
    ...content,
    ...(content.type !== "mention"
      ? {
          ...mapContentPeople(content.content, block),
        }
      : !content.attrs?.id
      ? {}
      : {
          attrs: {
            ...content.attrs,
            recordId: block.people.find((p) => p.personId === content.attrs?.id)
              ?.id,
          },
        }),
  });

const mapListItem = (
  wrapperType: string,
  prev: EditorJsonContent[],
  content: EditorJsonContent,
  block: NoteBlockData
): EditorJsonContent[] => {
  const preparedContent: EditorJsonContent = {
    ...content,
    attrs: {
      ...content.attrs,
      blockId: block.id,
      ...(!(wrapperType === "taskList" && block.todo.id)
        ? {}
        : { todoId: block.todo.id }),
    },
    ...mapContentPeople(content.content, block),
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

const mapTodoBlock = (block: NoteBlockData): EditorJsonContent => {
  const content: EditorJsonContent = JSON.parse(block.todo.todo as any);
  return {
    ...content,
    attrs: {
      ...content.attrs,
      todoId: block.todo.id,
      blockId: block.id,
    },
    ...mapContentPeople(content.content, block),
  };
};

const mapContentPeople = (
  content: EditorJsonContent[] | undefined,
  block: NoteBlockData
) => (!content ? {} : { content: content.map(mapPeople(block)) });

const mapBlocks =
  (noteBlocks: NoteBlockData[]) =>
  (prev: EditorJsonContent[], blockId: string): EditorJsonContent[] => {
    const block = noteBlocks.find((block) => block.id === blockId);
    if (!block) return prev;
    const content: EditorJsonContent =
      block.type === "taskItem"
        ? mapTodoBlock(block)
        : JSON.parse(block.content as any);
    if (content.type === "listItem")
      return mapListItem("bulletList", prev, content, block);
    if (content.type === "taskItem")
      return mapListItem("taskList", prev, content, block);
    return [
      ...prev,
      {
        ...content,
        attrs: { ...content.attrs, blockId },
        ...mapContentPeople(content.content, block),
      },
    ];
  };

export const transformNotesVersion3 = (
  noteBlocks: NoteBlockData[],
  noteBlockIds: ActivityData["noteBlockIds"]
) => ({
  type: "doc",
  content: flow(reduce(mapBlocks(noteBlocks), []), compact)(noteBlockIds) ?? [],
});
