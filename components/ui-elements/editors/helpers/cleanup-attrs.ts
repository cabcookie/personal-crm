import { type Schema } from "@/amplify/data/resource";
import { Activity, TempIdMapping } from "@/api/useActivity";
import { Editor, JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/api";
import { isEqual } from "lodash";
import { flow } from "lodash/fp";
import { getBlockIds } from "./blocks";
import TransactionError from "./transaction-error";
const client = generateClient<Schema>();

export const mapIds = (
  editor: Editor,
  attrName: string,
  mappings: TempIdMapping[]
) => {
  if (mappings.length === 0) return;
  const { view } = editor;
  const { state, dispatch } = view;
  const { tr, doc } = state;
  const updateTr = tr.setMeta("addToHistory", false);
  doc.descendants((node, nodePos, parent) => {
    if (!parent) return true;
    const mapping = mappings.find((m) => node.attrs[attrName] === m.tempId);
    if (mapping) {
      updateTr.setNodeMarkup(nodePos, null, {
        ...node.attrs,
        [attrName]: mapping.id,
      });
    }
  });
  if (updateTr.steps.length > 0) {
    dispatch(updateTr);
  }
};

export const addAttrsInEditorContent = (editor: Editor) => {
  const { view } = editor;
  const { state, dispatch } = view;
  const { tr, doc } = state;
  const updateTr = tr.setMeta("addToHistory", false);
  const existingBlockIds: string[] = [];
  const existingTodoIds: string[] = [];
  doc.descendants((node, nodePos, parent) => {
    if (!parent) return true;
    if (
      ["doc", "bulletList", "taskList"].includes(parent.type.name) &&
      !["bulletList", "taskList"].includes(node.type.name)
    ) {
      const attrs: Record<string, any> = {};
      /* set blockId if not existent or duplicate */
      if (!node.attrs.blockId || existingBlockIds.includes(node.attrs.blockId))
        attrs["blockId"] = crypto.randomUUID();
      else if (node.attrs.blockId) existingBlockIds.push(node.attrs.blockId);

      /* set todoId if not existent or duplicate */
      if (
        node.type.name === "taskItem" &&
        (!node.attrs.todoId || existingTodoIds.includes(node.attrs.todoId))
      )
        attrs["todoId"] = crypto.randomUUID();
      else if (node.attrs.todoId) existingTodoIds.push(node.attrs.todoId);

      /* if we set attrs we update the descendant */
      if (attrs && Object.keys(attrs).length > 0)
        updateTr.setNodeMarkup(nodePos, null, {
          ...node.attrs,
          ...attrs,
        });
    } else if (node.type.name === "mention" && !node.attrs.recordId) {
      /* set recordId on mentioned people */
      updateTr.setNodeMarkup(nodePos, null, {
        ...node.attrs,
        recordId: crypto.randomUUID(),
      });
    } else {
      /* reset blockId on all other nodes */
      if (node.attrs.blockId) {
        updateTr.setNodeMarkup(nodePos, null, {
          ...node.attrs,
          blockId: null,
        });
      }
    }
  });
  if (updateTr.steps.length > 0) {
    dispatch(updateTr);
  }
};

const compareEditorBlockIdsWithActivityBlockIds =
  (activity: Activity) =>
  (editorBlockIds: string[]): string[] =>
    isEqual(activity.noteBlockIds, editorBlockIds) ? [] : editorBlockIds;

export const getBlockIdsUpdateSet = (
  editor: Editor,
  activity: Activity
): string[] =>
  flow(
    getBlockIds,
    compareEditorBlockIdsWithActivityBlockIds(activity)
  )(editor.getJSON());

export const updateActivityBlockIds =
  (activity: Activity, content: JSONContent) => async (blockIds: string[]) => {
    if (blockIds.length === 0) return;
    const { data, errors } = await client.models.Activity.update({
      id: activity.id,
      noteBlockIds: blockIds,
      formatVersion: 3,
      notes: null,
      notesJson: null,
    });
    if (errors)
      throw new TransactionError(
        "Updating note block IDs failed",
        content,
        "updateActivityBlockIds",
        errors
      );
    if (!data)
      throw new TransactionError(
        "Updating note block IDs returned no data",
        content,
        "updateActivityBlockIds"
      );
  };
