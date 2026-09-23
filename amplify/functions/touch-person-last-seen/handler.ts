import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import type { DynamoDBStreamEvent, DynamoDBRecord } from "aws-lambda";

/**
 * Stamp Person.lastSeen from MeetingParticipant / NoteBlockPerson INSERTs.
 * See resource.ts for the rationale. Direct DDB, owner-preserving, forward-only.
 */

const ddb = new DynamoDBClient({});

const TABLE_PERSON = process.env.DDB_TABLE_PERSON;
if (!TABLE_PERSON) throw new Error("Missing env DDB_TABLE_PERSON");

/** Pull the referenced personId + createdAt from a stream record's new image. */
const extract = (
  record: DynamoDBRecord
): { personId: string; seenAt: string } | null => {
  if (record.eventName !== "INSERT") return null;
  const img = record.dynamodb?.NewImage;
  const personId = img?.personId?.S;
  if (!personId) return null;
  // Both junction models carry `createdAt`; fall back to the stream time.
  const seenAt =
    img?.createdAt?.S ??
    (record.dynamodb?.ApproximateCreationDateTime
      ? new Date(
          record.dynamodb.ApproximateCreationDateTime * 1000
        ).toISOString()
      : new Date().toISOString());
  return { personId, seenAt };
};

/**
 * Keep only the latest seenAt per person within this batch, so we issue one
 * UpdateItem per person instead of one per record.
 */
const collapse = (records: DynamoDBRecord[]): Map<string, string> => {
  const latest = new Map<string, string>();
  for (const r of records) {
    const e = extract(r);
    if (!e) continue;
    const prev = latest.get(e.personId);
    if (!prev || e.seenAt > prev) latest.set(e.personId, e.seenAt);
  }
  return latest;
};

const touch = async (personId: string, seenAt: string): Promise<void> => {
  try {
    await ddb.send(
      new UpdateItemCommand({
        TableName: TABLE_PERSON,
        Key: { id: { S: personId } },
        UpdateExpression: "SET lastSeen = :s",
        // Forward-only: only advance lastSeen, and only for an existing person.
        ConditionExpression:
          "attribute_exists(id) AND (attribute_not_exists(lastSeen) OR lastSeen < :s)",
        ExpressionAttributeValues: { ":s": { S: seenAt } },
      })
    );
  } catch (err) {
    // The conditional check failing (person gone, or already newer) is expected
    // and not an error worth failing the batch over.
    const name = (err as { name?: string })?.name;
    if (name === "ConditionalCheckFailedException") return;
    console.error("touch-person-last-seen: update failed", personId, err);
    throw err;
  }
};

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  const latest = collapse(event.Records ?? []);
  await Promise.all(
    [...latest.entries()].map(([personId, seenAt]) => touch(personId, seenAt))
  );
};
