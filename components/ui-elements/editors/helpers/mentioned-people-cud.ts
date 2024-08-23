/* Create, update, delete operations on mentioned people (i.e., NoteMentionedPersonPerson) */

import { type Schema } from "@/amplify/data/resource";
import { Activity, TempIdMapping } from "@/api/useActivity";
import { not } from "@/helpers/functional";
import { Editor, JSONContent } from "@tiptap/core";
import { generateClient } from "aws-amplify/api";
import { filter, flow, get, map, reduce, some } from "lodash/fp";
import { mapIds } from "./cleanup-attrs";
import TransactionError from "./transaction-error";
const client = generateClient<Schema>();

type TMentionedPersonCreationSet = {
  tempId: string;
  personId: string;
  blockId: string;
};

type TMentionedPersonDeleteSet = {
  recordId: string;
};

const doesNotExist = (notes: JSONContent) => (block: JSONContent) =>
  flow(
    getPeopleMentioned,
    some((b) => b.attrs?.recordId === block.attrs?.recordId),
    not
  )(notes);

const mapToCreationSet = (block: JSONContent): TMentionedPersonCreationSet => {
  if (!block.attrs?.recordId)
    throw new TransactionError(
      "recordId not set on mentioned person that should be stored in database",
      block,
      "mapToCreationSet"
    );
  return {
    blockId: block.attrs.blockId,
    personId: block.attrs.id,
    tempId: block.attrs.recordId,
  };
};

type MentionedPersonTempIdMapping = TempIdMapping & {
  blockId: string;
  personId: string;
};

const createMentionedPerson = async ({
  blockId,
  personId,
  tempId,
}: TMentionedPersonCreationSet): Promise<MentionedPersonTempIdMapping> => {
  const { data, errors } = await client.models.NoteBlockPerson.create({
    noteBlockId: blockId,
    personId,
  });
  if (errors)
    throw new TransactionError(
      "Creating mentioned person failed",
      blockId,
      "createMentionedPerson",
      errors
    );
  if (!data)
    throw new TransactionError(
      "Creating mentioned person returned no data",
      blockId,
      "createMentionedPerson"
    );
  return {
    tempId,
    id: data.id,
    blockId,
    personId,
  };
};

const getMentionedPersonCreationSet = (
  editor: Editor,
  activity: Activity
): TMentionedPersonCreationSet[] =>
  flow(
    getPeopleMentioned,
    filter(doesNotExist(activity.notes)),
    map(mapToCreationSet)
  )(editor.getJSON());

const findPeopleMentioned =
  (blockId?: string) =>
  (prev: JSONContent[], curr: JSONContent): JSONContent[] => {
    if (curr.type === "mention")
      return [
        ...prev,
        {
          ...curr,
          attrs: {
            ...curr.attrs,
            blockId,
          },
        },
      ];
    if (curr.content?.length)
      return [
        ...prev,
        ...curr.content.reduce(
          findPeopleMentioned(blockId ?? curr.attrs?.blockId),
          []
        ),
      ];
    return prev;
  };

const emptyRecord = (block: JSONContent): boolean =>
  Boolean(block.attrs?.recordId);

export const getPersonId = (person: JSONContent) =>
  !person.attrs?.id ? undefined : (person.attrs.id as string);

export const getPeopleMentioned = (content: JSONContent): JSONContent[] =>
  flow(
    get("content"),
    reduce(findPeopleMentioned(), [] as JSONContent[])
  )(content);

const mapDeleteSet = (block: JSONContent): TMentionedPersonDeleteSet => {
  if (!block.attrs?.recordId)
    throw new TransactionError(
      "recordId not set on person mentioned should be deleted in database",
      block,
      "mapDeleteSet"
    );
  return {
    recordId: block.attrs.recordId,
  };
};

const deleteMentionedPerson = async ({
  recordId,
}: TMentionedPersonDeleteSet) => {
  const { data, errors } = await client.models.NoteBlockPerson.delete({
    id: recordId,
  });
  if (errors)
    throw new TransactionError(
      "Deleting mentioned person failed",
      null,
      `deleteMentionedPerson(${recordId})`,
      errors
    );
  if (!data)
    throw new TransactionError(
      "Deleting mentioned person returned no data",
      null,
      `deleteMentionedPerson(${recordId})`
    );
};

const getMentionedPersonDeleteSet = (
  editor: Editor,
  activity: Activity
): TMentionedPersonDeleteSet[] =>
  flow(
    getPeopleMentioned,
    filter(emptyRecord),
    filter(doesNotExist(editor.getJSON())),
    map(mapDeleteSet)
  )(activity.notes);

export const deleteAndCreateMentionedPeople = async (
  editor: Editor,
  activity: Activity
) => {
  /* Delete mentioned people where neccessary */
  await Promise.all(
    flow(getMentionedPersonDeleteSet, map(deleteMentionedPerson))(
      editor,
      activity
    )
  );

  /* Create mentioned people where neccessary */
  const mentionedPersonIdMapping = await Promise.all(
    flow(getMentionedPersonCreationSet, map(createMentionedPerson))(
      editor,
      activity
    )
  );
  mapIds(editor, "recordId", mentionedPersonIdMapping);
};
