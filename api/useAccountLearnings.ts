import { type Schema } from "@/amplify/data/resource";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { toast } from "@/components/ui/use-toast";
import { invertSign, not, toISODateString } from "@/helpers/functional";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/data";
import { getTime } from "date-fns";
import {
  filter,
  flatMap,
  flow,
  get,
  identity,
  includes,
  map,
  sortBy,
  uniq,
} from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";

const client = generateClient<Schema>();

export type AccountLearning = {
  id: string;
  learning: JSONContent;
  learnedOn: Date;
  updatedAt: Date;
};

type AccountLearningData = Schema["AccountLearning"]["type"];

const mapLearning = ({
  id,
  createdAt,
  updatedAt,
  learnedOn,
  learning,
}: AccountLearningData): AccountLearning => ({
  id,
  learning: transformNotesVersion({
    formatVersion: 2,
    notes: "",
    notesJson: learning,
  }),
  learnedOn: new Date(learnedOn || createdAt),
  updatedAt: new Date(updatedAt),
});

const fetchLearnings = (accountId?: string) => async () => {
  if (!accountId) return;
  const { data, errors } =
    await client.models.AccountLearning.listAccountLearningByAccountId(
      { accountId },
      { filter: { status: { eq: "new" } } }
    );
  if (errors) {
    handleApiErrors(errors, "Loading learnings about account failed");
    throw errors;
  }
  try {
    return flow(
      map(mapLearning),
      sortBy(
        flow(identity<AccountLearning>, get("learnedOn"), getTime, invertSign)
      )
    )(data);
  } catch (error) {
    console.error("fetchLearnings", error);
    throw error;
  }
};

const useAccountLearnings = (accountId?: string) => {
  const {
    data: learnings,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/accounts/${accountId}/learnings`, fetchLearnings(accountId));

  const createLearning = async () => {
    if (!accountId) return;
    const updated = [
      {
        id: crypto.randomUUID(),
        learnedOn: new Date(),
        learning: emptyDocument,
        updatedAt: new Date(),
      } as AccountLearning,
      ...(learnings || []),
    ];
    mutate(updated, false);
    const { data, errors } = await client.models.AccountLearning.create({
      accountId,
      learnedOn: toISODateString(new Date()),
      status: "new",
    });
    if (errors) handleApiErrors(errors, "Creating learning on account failed");
    mutate(updated);
    return data?.id;
  };

  const deleteLearning = async (learningId: string) => {
    const updated = learnings?.filter((l) => l.id !== learningId);
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.AccountLearning.delete({
      id: learningId,
    });
    if (errors) handleApiErrors(errors, "Deleting learning failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({ title: "Learning about account deleted" });
    return data.id;
  };

  const updateDate = async (learningId: string, date: Date) => {
    const updated = learnings?.map((l) =>
      l.id !== learningId ? l : { ...l, learnedOn: date }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.AccountLearning.update({
      id: learningId,
      learnedOn: toISODateString(date),
    });
    if (errors) handleApiErrors(errors, "Updating learning's date failed");
    if (updated) mutate(updated);
    return data?.id;
  };

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

  const updateMentionedPeople = async (
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

  const updateLearning = async (learningId: string, learning: JSONContent) => {
    if (!learnings) return;
    const updated = learnings.map((l) =>
      l.id !== learningId
        ? l
        : ({
            ...l,
            learning,
            updatedAt: new Date(),
          } as AccountLearning)
    );
    mutate(updated, false);
    const { data, errors } = await client.models.AccountLearning.update({
      id: learningId,
      learning: JSON.stringify(learning),
    });
    if (errors)
      handleApiErrors(errors, "Error updating learning about account");
    mutate(updated);
    await updateMentionedPeople(learningId, learning);
    return data?.id;
  };

  return {
    learnings,
    isLoading,
    error,
    createLearning,
    deleteLearning,
    updateLearning,
    updateDate,
  };
};

export default useAccountLearnings;
