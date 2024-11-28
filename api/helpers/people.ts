import { type Schema } from "@/amplify/data/resource";
import { newDateTimeString } from "@/helpers/functional";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const createMentionedPersonApi = (
  noteBlockId: string,
  personId: string
) =>
  client.models.NoteBlockPerson.create({
    noteBlockId,
    personId,
    createdAt: newDateTimeString(),
  });
