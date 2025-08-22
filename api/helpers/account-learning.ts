import { not } from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  includes,
  map,
  uniq,
} from "lodash/fp";
import { handleApiErrors } from "../globals";

import { client } from "@/lib/amplify";

const getMentionedPeople = async (learningId: string) => {
  const { data, errors } =
    await client.models.AccountLearningPerson.listAccountLearningPersonByLearningId(
      { learningId },
      { selectionSet: ["id", "personId"] }
    );
  if (errors) handleApiErrors(errors, "Loading mentioned people failed");
  return data;
};

const addMentionedPerson = async (learningId: string, personId: string) => {
  const { data, errors } = await client.models.AccountLearningPerson.create({
    learningId,
    personId,
  });
  if (errors) handleApiErrors(errors, "Adding mentioned person failed");
  return data?.personId;
};

const removeMentionedPerson = async (recordId: string) => {
  const { data, errors } = await client.models.AccountLearningPerson.delete({
    id: recordId,
  });
  if (errors) handleApiErrors(errors, "Removing mentioned person failed");
  return data?.personId;
};

export const updateMentionedPeople = async (
  learningId: string,
  learning: JSONContent
) => {
  const peopleIds = flow(
    identity<JSONContent>,
    get("content"),
    flatMap("content"),
    filter({ type: "mention" }),
    map("attrs.id"),
    uniq
  )(learning) as string[];
  const existingPeople = await getMentionedPeople(learningId);
  const toAdd = peopleIds.filter((id) =>
    flow(
      identity<typeof existingPeople>,
      map("personId"),
      includes(id),
      not
    )(existingPeople)
  );
  const toRemove = flow(
    identity<typeof existingPeople>,
    filter(({ personId }) => !peopleIds.includes(personId)),
    map("id")
  )(existingPeople);
  const added = await Promise.all(
    toAdd.map((personId) => addMentionedPerson(learningId, personId))
  );
  const removed = await Promise.all(toRemove.map(removeMentionedPerson));
  return { added, removed };
};
