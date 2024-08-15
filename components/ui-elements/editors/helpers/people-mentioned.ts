import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { ActivityData } from "@/api/useActivity";
import { generateClient } from "aws-amplify/api";
import { find, flatten, flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../notes-editor/useExtensions";
import { getBlockFromId } from "./blocks";
const client = generateClient<Schema>();

export type MentionedPerson = { id: string; personId: string };

export type BlockMentionedPeople = {
  id: string;
  people: MentionedPerson[];
};

const getMentionedPeopleIds = (
  content: EditorJsonContent["content"]
): string[] =>
  flow(
    (c) => c as EditorJsonContent["content"],
    map((c) =>
      c.type === "mention" ? c.attrs?.id : getMentionedPeopleIds(c.content)
    ),
    flatten
  )(content);

const getExistingMentionedPeopleIds = (
  blockId: string,
  blocksMentionedPeople: BlockMentionedPeople[]
) =>
  flow(
    getBlockFromId(blocksMentionedPeople),
    getMentionedPeopleFromBlock
  )(blockId);

export const getMentionedPeopleFromBlock = (
  mentionedPeople: BlockMentionedPeople | undefined
): MentionedPerson[] =>
  mentionedPeople?.people.map(({ id, personId }) => ({ id, personId })) ?? [];

export const getMentionedPeopleFromBlocks = (
  noteBlocks: ActivityData["noteBlocks"],
  noteBlockIds: ActivityData["noteBlockIds"]
): BlockMentionedPeople[] =>
  !noteBlockIds
    ? []
    : map(
        (id: string): BlockMentionedPeople => ({
          id,
          people: flow(
            getBlockFromId(noteBlocks),
            getMentionedPeopleFromBlock
          )(id),
        })
      )(noteBlockIds);

const removePeopleLinkIfNeeded =
  (
    blocksMentionedPeople: BlockMentionedPeople[],
    blockId: string,
    block: EditorJsonContent
  ) =>
  async (personId: string) => {
    const existingPeopleIds = getMentionedPeopleIds(block.content);
    if (existingPeopleIds.includes(personId)) return;
    const personLinkToDelete = flow(
      getBlockFromId(blocksMentionedPeople),
      get("people"),
      find((p) => p.personId === personId),
      get("id")
    )(blockId);
    if (!personLinkToDelete) return;
    const { data, errors } = await client.models.NoteBlockPerson.delete({
      id: personLinkToDelete,
    });
    if (errors) handleApiErrors(errors, "Deleting block/person link failed");
    return data?.id;
  };

const createPeopleLinkIfNeeded =
  (blocksMentionedPeople: BlockMentionedPeople[], blockId: string) =>
  async (personId: string) => {
    const existingPeopleIds = getExistingMentionedPeopleIds(
      blockId,
      blocksMentionedPeople
    );
    if (existingPeopleIds.some((p) => p.personId === personId)) return;
    const { data, errors } = await client.models.NoteBlockPerson.create({
      noteBlockId: blockId,
      personId,
    });
    if (errors) handleApiErrors(errors, "Creating block/person link failed");
    return data?.id;
  };

export const linkMentionedPeople = async (
  blocksMentionedPeople: BlockMentionedPeople[],
  blockId: string,
  block: EditorJsonContent
) => {
  const createdLinksIds = await Promise.all(
    flow(
      getMentionedPeopleIds,
      map(createPeopleLinkIfNeeded(blocksMentionedPeople, blockId))
    )(block.content)
  );
  const removedLinksIds = await Promise.all(
    flow(
      getExistingMentionedPeopleIds,
      map(removePeopleLinkIfNeeded(blocksMentionedPeople, blockId, block))
    )(blockId, blocksMentionedPeople)
  );

  return {
    createdLinkIds: createdLinksIds.filter((id) => !!id),
    removedLinkIds: removedLinksIds.filter((id) => !!id),
  };
};
