import { type Schema } from "@/amplify/data/resource";
import { GraphQLFormattedError, handleApiErrors } from "@/api/globals";
import { ActivityData } from "@/api/useActivity";
import { newDateString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/api";
import { compact, flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";
import { stringifyBlock } from "./blocks";
import { linkMentionedPeople } from "./people-mentioned";
const client = generateClient<Schema>();

const createNoteBlockLinkedToTodo = async (
  activity: ActivityData,
  todoId: string,
  block: EditorJsonContent
) => {
  const { data, errors } = await client.models.NoteBlock.create({
    activityId: activity.id,
    formatVersion: 3,
    todoId,
    type: "taskItem",
  });
  if (errors) {
    handleApiErrors(errors, "Updating Note to v3 failed (with linked todo)");
    throw errors;
  }
  if (!data) return;
  const result = await linkMentionedPeople(activity, data.id, block);
  console.log("linking mentioned people", result);
  return data.id;
};

export const createTodoAndNoteBlock = async (
  activity: ActivityData,
  block: EditorJsonContent
) => {
  const checked = (block.attrs?.checked ?? false) as boolean;
  const { data, errors } = await client.models.Todo.create({
    todo: stringifyBlock(block),
    status: checked ? "DONE" : "OPEN",
    doneOn: checked ? newDateString() : null,
    projectIds: flow(
      get("forProjects"),
      map(get("projectsId"), compact)
    )(activity),
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
  return createNoteBlockLinkedToTodo(activity, data.id, block);
};
