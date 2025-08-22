import { newDateTimeString } from "@/helpers/functional";
import { client } from "@/lib/amplify";

export const createMentionedPersonApi = (
  noteBlockId: string,
  personId: string
) =>
  client.models.NoteBlockPerson.create({
    noteBlockId,
    personId,
    createdAt: newDateTimeString(),
  });
