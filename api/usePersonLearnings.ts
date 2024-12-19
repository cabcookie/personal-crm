import { type Schema } from "@/amplify/data/resource";
import { TPrayerStatus } from "@/components/prayer/PrayerStatus";
import { emptyDocument } from "@/components/ui-elements/editors/helpers/document";
import { toast } from "@/components/ui/use-toast";
import { invertSign, toISODateString } from "@/helpers/functional";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/data";
import { getTime } from "date-fns";
import { flow, get, identity, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type PersonLearning = {
  id: string;
  learning: JSONContent;
  learnedOn: Date;
  updatedAt: Date;
  prayerStatus: TPrayerStatus;
};

const mapLearning = ({
  id,
  createdAt,
  updatedAt,
  learnedOn,
  learning,
  prayer,
}: Schema["PersonLearning"]["type"]): PersonLearning => ({
  id,
  learning: transformNotesVersion({
    formatVersion: 2,
    notes: "",
    notesJson: learning,
  }),
  learnedOn: new Date(learnedOn || createdAt),
  prayerStatus: prayer || "NONE",
  updatedAt: new Date(updatedAt),
});

const fetchLearnings = (personId?: string) => async () => {
  if (!personId) return;
  const { data, errors } =
    await client.models.PersonLearning.listPersonLearningByPersonId(
      {
        personId,
      },
      { filter: { status: { eq: "new" } } }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading person learnings");
    throw errors;
  }
  if (!data) return;
  try {
    return flow(
      map(mapLearning),
      sortBy(
        flow(identity<PersonLearning>, get("learnedOn"), getTime, invertSign)
      )
    )(data);
  } catch (error) {
    console.error("fetchLearnings", { error });
    throw error;
  }
};

const usePersonLearnings = (personId?: string) => {
  const { data: learnings, mutate } = useSWR(
    `/api/people/${personId}/learnings`,
    fetchLearnings(personId)
  );

  const createLearning = async () => {
    if (!personId) return;
    const updated: PersonLearning[] = [
      {
        id: crypto.randomUUID(),
        learnedOn: new Date(),
        learning: emptyDocument,
        prayerStatus: "NONE",
        updatedAt: new Date(),
      },
      ...(learnings || []),
    ];
    mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.create({
      personId,
      learnedOn: toISODateString(new Date()),
      prayer: "NONE",
      status: "new",
    });
    if (errors) handleApiErrors(errors, "Creating learning on person failed");
    mutate(updated);
    return data?.id;
  };

  const deleteLearning = async (learningId: string) => {
    const updated: PersonLearning[] | undefined = learnings?.filter(
      (l) => l.id !== learningId
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.delete({
      id: learningId,
    });
    if (errors) handleApiErrors(errors, "Deleting learning failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({ title: "Learning about person deleted" });
    return data.id;
  };

  const updatePrayerStatus = async (
    learningId: string,
    status: TPrayerStatus
  ) => {
    const updated: PersonLearning[] | undefined = learnings?.map((l) =>
      l.id !== learningId ? l : { ...l, prayerStatus: status }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.update({
      id: learningId,
      prayer: status,
    });
    if (errors) handleApiErrors(errors, "Updating prayer status failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const updateDate = async (learningId: string, date: Date) => {
    const updated: PersonLearning[] | undefined = learnings?.map((l) =>
      l.id !== learningId ? l : { ...l, learnedOn: date }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.update({
      id: learningId,
      learnedOn: toISODateString(date),
    });
    if (errors) handleApiErrors(errors, "Updating learning's date failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const updateLearning = async (learningId: string, learning: JSONContent) => {
    if (!learnings) return;
    const updated: PersonLearning[] = learnings.map((l) =>
      l.id !== learningId
        ? l
        : {
            ...l,
            learning,
            updatedAt: new Date(),
          }
    );
    mutate(updated, false);
    const { data, errors } = await client.models.PersonLearning.update({
      id: learningId,
      learning: JSON.stringify(learning),
    });
    if (errors) handleApiErrors(errors, "Error updating learning about person");
    mutate(updated);
    return data?.id;
  };

  return {
    learnings,
    createLearning,
    deleteLearning,
    updateLearning,
    updateDate,
    updatePrayerStatus,
  };
};

export default usePersonLearnings;
