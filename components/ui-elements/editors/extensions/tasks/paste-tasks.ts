import { Extension } from "@tiptap/core";
import {
  Fragment,
  Node as ProseMirrorNode,
  Schema,
  Slice,
} from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const TASK_PREFIX_REGEX = /^\s*\[([ xX]?)\]\s+/;

const stripTaskPrefix = (
  paragraph: ProseMirrorNode,
  schema: Schema
): ProseMirrorNode => {
  const children: ProseMirrorNode[] = [];
  let prefixRemoved = false;

  paragraph.content.forEach((child) => {
    if (prefixRemoved || !child.isText || !child.text) {
      children.push(child);
      return;
    }
    const match = child.text.match(TASK_PREFIX_REGEX);
    if (!match) {
      children.push(child);
      return;
    }
    prefixRemoved = true;
    const newText = child.text.slice(match[0].length);
    if (newText.length > 0) children.push(schema.text(newText, child.marks));
  });

  return paragraph.copy(Fragment.from(children));
};

const getFirstParagraphText = (listItem: ProseMirrorNode): string | null => {
  const firstChild = listItem.firstChild;
  if (!firstChild || firstChild.type.name !== "paragraph") return null;
  return firstChild.textContent;
};

const areAllItemsTasks = (
  bulletList: ProseMirrorNode,
  listItemType: string
): boolean => {
  if (bulletList.childCount === 0) return false;
  let allTasks = true;
  bulletList.forEach((child) => {
    if (child.type.name !== listItemType) {
      allTasks = false;
      return;
    }
    const text = getFirstParagraphText(child);
    if (text === null || !TASK_PREFIX_REGEX.test(text)) allTasks = false;
  });
  return allTasks;
};

const convertListItemToTaskItem = (
  listItem: ProseMirrorNode,
  schema: Schema
): ProseMirrorNode | null => {
  const taskItemType = schema.nodes.taskItem;
  if (!taskItemType) return null;

  const firstChild = listItem.firstChild;
  if (!firstChild || firstChild.type.name !== "paragraph") return null;

  const text = firstChild.textContent;
  const match = text.match(TASK_PREFIX_REGEX);
  if (!match) return null;
  const checked = match[1] === "x" || match[1] === "X";

  const newChildren: ProseMirrorNode[] = [];
  let prefixStripped = false;
  listItem.content.forEach((child) => {
    if (!prefixStripped && child.type.name === "paragraph") {
      newChildren.push(stripTaskPrefix(child, schema));
      prefixStripped = true;
      return;
    }
    newChildren.push(child);
  });

  return taskItemType.create({ checked }, Fragment.from(newChildren));
};

const transformFragment = (fragment: Fragment, schema: Schema): Fragment => {
  const bulletListType = schema.nodes.bulletList;
  const taskListType = schema.nodes.taskList;
  const listItemTypeName = schema.nodes.listItem?.name ?? "listItem";

  const newChildren: ProseMirrorNode[] = [];

  fragment.forEach((node) => {
    if (
      bulletListType &&
      taskListType &&
      node.type === bulletListType &&
      areAllItemsTasks(node, listItemTypeName)
    ) {
      const taskItems: ProseMirrorNode[] = [];
      let conversionSucceeded = true;
      node.forEach((listItem) => {
        const taskItem = convertListItemToTaskItem(listItem, schema);
        if (!taskItem) {
          conversionSucceeded = false;
          return;
        }
        taskItems.push(taskItem);
      });
      if (conversionSucceeded && taskItems.length > 0) {
        newChildren.push(taskListType.create(null, Fragment.from(taskItems)));
        return;
      }
    }

    if (node.content.size === 0) {
      newChildren.push(node);
      return;
    }
    const transformedContent = transformFragment(node.content, schema);
    newChildren.push(node.copy(transformedContent));
  });

  return Fragment.from(newChildren);
};

export const PasteTasks = Extension.create({
  name: "pasteTasks",

  addProseMirrorPlugins() {
    const { schema } = this.editor;
    if (!schema.nodes.taskList || !schema.nodes.taskItem) return [];
    if (!schema.nodes.bulletList || !schema.nodes.listItem) return [];

    return [
      new Plugin({
        key: new PluginKey("pasteTasks"),
        props: {
          transformPasted: (slice) => {
            const newContent = transformFragment(slice.content, schema);
            return new Slice(newContent, slice.openStart, slice.openEnd);
          },
        },
      }),
    ];
  },
});
