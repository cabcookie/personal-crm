import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { ActivityData, NoteBlockData } from "@/api/useActivity";
import { generateClient } from "aws-amplify/api";
import { compact, find, flatMap, flatten, flow, get, map } from "lodash/fp";
import { EditorJsonContent } from "../../notes-writer/useExtensions";
import { getBlockFromId } from "./blocks";
const client = generateClient<Schema>();

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
  blocks: NoteBlockData[]
) => flow(getBlockFromId(blocks), getMentionedPeopleFromBlock)(blockId);

export const getMentionedPeopleFromBlock = (
  block: NoteBlockData | undefined
): string[] =>
  !block ? [] : flow(map(get("personId")), compact)(block.people);

export const getMentionedPeopleFromBlocks = (activity: {
  noteBlocks: ActivityData["noteBlocks"];
  noteBlockIds: ActivityData["noteBlockIds"];
}): string[] =>
  flow(
    map(getBlockFromId(activity.noteBlocks)),
    compact,
    flatMap(getMentionedPeopleFromBlock)
  )(activity.noteBlockIds);

const removePeopleLinkIfNeeded =
  (blocks: NoteBlockData[], blockId: string, block: EditorJsonContent) =>
  async (personId: string) => {
    const existingPeopleIds = getMentionedPeopleIds(block.content);
    if (existingPeopleIds.includes(personId)) return;
    const personLinkToDelete = flow(
      getBlockFromId(blocks),
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
  (activity: ActivityData, blockId: string) => async (personId: string) => {
    const existingPeopleIds = getExistingMentionedPeopleIds(
      blockId,
      activity.noteBlocks
    );
    if (existingPeopleIds.includes(personId)) return;
    const { data, errors } = await client.models.NoteBlockPerson.create({
      noteBlockId: blockId,
      personId,
    });
    if (errors) handleApiErrors(errors, "Creating block/person link failed");
    return data?.id;
  };

export const linkMentionedPeople = async (
  activity: ActivityData,
  blockId: string,
  block: EditorJsonContent
) => {
  const createdLinksIds = await Promise.all(
    flow(
      getMentionedPeopleIds,
      map(createPeopleLinkIfNeeded(activity, blockId))
    )(block.content)
  );
  const removedLinksIds = await Promise.all(
    flow(
      getExistingMentionedPeopleIds,
      map(removePeopleLinkIfNeeded(activity.noteBlocks, blockId, block))
    )(blockId, activity.noteBlocks)
  );

  return {
    createdLinkIds: createdLinksIds.filter((id) => !!id),
    removedLinkIds: removedLinksIds.filter((id) => !!id),
  };
};
