import { type Schema } from "@/amplify/data/resource";
import { GraphQLFormattedError, handleApiErrors } from "@/api/globals";
import { newDateString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/api";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { createNoteBlockApi, stringifyBlock } from "./blocks";
import { BlockMentionedPeople, linkMentionedPeople } from "./people-mentioned";
const client = generateClient<Schema>();

const createNoteBlockLinkedToTodo = async (
  activityId: string,
  blocksMentionedPeople: BlockMentionedPeople[],
  todoId: string,
  block: EditorJsonContent
) => {
  const data = await createNoteBlockApi(activityId, block, todoId);
  if (!data) return;
  await linkMentionedPeople(blocksMentionedPeople, data.id, block);
  return data.id;
};

export const createTodoAndNoteBlock = async (
  activityId: string,
  blocksMentionedPeople: BlockMentionedPeople[],
  projectIds: string[],
  block: EditorJsonContent
) => {
  const checked = (block.attrs?.checked ?? false) as boolean;
  const { data, errors } = await client.models.Todo.create({
    todo: stringifyBlock(block),
    status: checked ? "DONE" : "OPEN",
    doneOn: checked ? newDateString() : null,
    projectIds,
  });
  if (errors) {
    handleApiErrors(errors, "Creating Todo failed");
    throw errors;
  }
  if (!data) {
    const error: GraphQLFormattedError = {
      message: "Creating Todo didn't retrieve resulting data",
      errorType: "No data retrieved",
      errorInfo: null,
    };
    handleApiErrors([error], "Creating Todo failed; no data");
    throw error;
  }
  return createNoteBlockLinkedToTodo(
    activityId,
    blocksMentionedPeople,
    data.id,
    block
  );
};
