import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { JSONContent } from "@tiptap/core";
import { compact, flow, identity, last, reduce } from "lodash/fp";

const mapPeople =
  (block: NoteBlockData) =>
  (content: JSONContent): JSONContent => ({
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
              recordId: block.people.find(
                (p) => p.personId === content.attrs?.id
              )?.id,
            },
          }),
  });

const mapListItem = (
  wrapperType: string,
  prev: JSONContent[],
  content: JSONContent,
  block: NoteBlockData
): JSONContent[] => {
  const preparedContent: JSONContent = {
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
    return [
      ...prev,
      {
        type: wrapperType,
        ...(wrapperType === "orderedList" ? { attrs: { start: 1 } } : {}),
        content: [preparedContent],
      },
    ];
  return prev.map((val, index) =>
    index !== prev.length - 1
      ? val
      : {
          ...prev[index],
          content: [...(prev[index].content ?? []), preparedContent],
        }
  );
};

const mapTodoBlock = (block: NoteBlockData): JSONContent => {
  const content: JSONContent = JSON.parse(block.todo.todo as any);
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
  content: JSONContent[] | undefined,
  block: NoteBlockData
) => (!content ? {} : { content: content.map(mapPeople(block)) });

const mapBlocks =
  (noteBlocks: NoteBlockData[]) =>
  (prev: JSONContent[], blockId: string): JSONContent[] => {
    const block = noteBlocks.find((block) => block.id === blockId);
    if (!block) return prev;
    const content: JSONContent =
      block.type === "taskItem"
        ? mapTodoBlock(block)
        : JSON.parse(block.content as any);
    if (content.type === "listItemOrdered")
      return mapListItem(
        "orderedList",
        prev,
        { ...content, type: "listItem" },
        block
      );
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
  content:
    flow(
      identity<ActivityData["noteBlockIds"]>,
      reduce(mapBlocks(noteBlocks), []),
      compact
    )(noteBlockIds) ?? [],
});
