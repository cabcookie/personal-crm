import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { createMentionedPersonApi } from "@/api/helpers/people";
import { createBlockApi, createTodoApi } from "@/api/helpers/todo";
import { stringifyBlock } from "@/components/ui-elements/editors/helpers/blocks";
import {
  getPeopleMentioned,
  getPersonId,
} from "@/components/ui-elements/editors/helpers/mentioned-people-cud";
import { JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/data";
import { compact, flow, map } from "lodash/fp";
const client = generateClient<Schema>();

const createTodo = async (block: JSONContent) => {
  if (block.type !== "taskItem") return;
  const { data, errors } = await createTodoApi(
    stringifyBlock(block),
    block.attrs?.checked
  );
  if (errors) handleApiErrors(errors, "Creating todo failed");
  if (!data) return;
  return data.id;
};

export const createNoteBlock = async (
  activityId: string,
  block: JSONContent,
  parentType?: string
) => {
  const todoId = await createTodo(block);
  const { data, errors } = await createBlockApi(
    activityId,
    !todoId ? stringifyBlock(block) : null,
    todoId,
    !block.type
      ? "paragraph"
      : parentType === "orderedList"
        ? "listItemOrdered"
        : block.type
  );
  if (errors) handleApiErrors(errors, "Creating note block failed");
  if (!data) return;

  const peopleIds = flow(getPeopleMentioned, map(getPersonId), compact)(block);

  if (peopleIds.length > 0) {
    await Promise.all(
      peopleIds.map((id) => createNoteBlockPerson(data.id, id))
    );
  }

  return data.id;
};

const createNoteBlockPerson = async (blockId: string, personId: string) => {
  const { errors } = await createMentionedPersonApi(blockId, personId);
  if (errors) handleApiErrors(errors, "Linking note block/person failed");
};

export const addActivityIdToInbox = async (
  inboxItemId: string,
  activityId: string
) => {
  const { data, errors } = await client.models.Inbox.update({
    id: inboxItemId,
    status: "done",
    movedToActivityId: activityId,
  });
  if (errors) handleApiErrors(errors, "Linking inbox item/activity failed");
  return data?.id;
};

export const updateMovedItemToPersonId = async (
  inboxItemId: string,
  personLearningId: string
) => {
  const { data, errors } = await client.models.Inbox.update({
    id: inboxItemId,
    movedToPersonLearningId: personLearningId,
    status: "done",
  });
  if (errors) handleApiErrors(errors, "Linking inbox item/person failed");
  return data?.id;
};

export const updateMovedItemToAccountId = async (
  inboxItemId: string,
  accountLearningId: string
) => {
  const { data, errors } = await client.models.Inbox.update({
    id: inboxItemId,
    movedToAccountLearningId: accountLearningId,
    status: "done",
  });
  if (errors) handleApiErrors(errors, "Linking inbox item/account failed");
  return data?.id;
};
