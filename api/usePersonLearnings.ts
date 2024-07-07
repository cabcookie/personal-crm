import { type Schema } from "@/amplify/data/resource";
import {
  EditorJsonContent,
  transformNotesVersion,
} from "@/components/ui-elements/notes-writer/NotesWriter";
import { generateClient } from "aws-amplify/data";
import { flow, map, sortBy } from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

export type PersonLearningCreateProps = {
  learning?: EditorJsonContent | string;
  learnedOn?: Date;
};

export type PersonLearningUpdateProps = PersonLearningCreateProps & {
  personLearningId: string;
};

export type PersonLearning = {
  id: string;
  learning: EditorJsonContent | string;
  learnedOn: Date;
  updatedAt: Date;
};

const mapLearning = ({
  id,
  createdAt,
  updatedAt,
  learnedOn,
  learning,
}: Schema["PersonLearning"]["type"]): PersonLearning => ({
  id,
  learning: transformNotesVersion({
    version: 2,
    notes: "",
    notesJson: learning,
  }),
  learnedOn: new Date(learnedOn || createdAt),
  updatedAt: new Date(updatedAt),
});

const fetchLearnings = (personId?: string) => async () => {
  if (!personId) return;
  const { data, errors } =
    await client.models.PersonLearning.listPersonLearningByPersonId({
      personId,
    });
  if (errors) throw errors;
  if (!data) return;
  return flow(
    map(mapLearning),
    sortBy((l) => -l.learnedOn.getTime())
  )(data);
};

const usePersonLearnings = (personId?: string) => {
  const { data: learnings } = useSWR(
    `/api/people/${personId}/learnings`,
    fetchLearnings(personId)
  );

  return { learnings };
};

export default usePersonLearnings;
