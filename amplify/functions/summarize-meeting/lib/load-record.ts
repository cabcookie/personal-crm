import type { DynamoDBRecord } from "aws-lambda";

/**
 * Thrown to skip a stream record without treating it as a failure. Mirrors
 * process-export-tasks/helpers/load-task-record.ts's SkipRecordError.
 */
export class SkipRecordError extends Error {
  private skipping: boolean;
  constructor(msg: string) {
    super(msg);
    this.skipping = true;
  }
  isSkipping() {
    return this.skipping;
  }
}

export type PendingSummaryTask = {
  meetingId: string;
  owner: string;
};

/**
 * Filters the Meeting table's stream down to the one transition that should
 * trigger a summary run: a MODIFY event where `sonicSummaryStatus` changes TO
 * "PENDING" (it was something else, or absent, beforehand). Both the initial
 * client-side trigger write and the Lambda's own terminal writes (DONE/ERROR)
 * flow through this same stream — only the former must be acted on.
 */
export const loadPendingSummaryRecord = (
  record: DynamoDBRecord
): PendingSummaryTask => {
  if (record.eventName !== "MODIFY")
    throw new SkipRecordError(`Skipping ${record.eventName} event`);

  const newImage = record.dynamodb?.NewImage;
  const oldImage = record.dynamodb?.OldImage;
  if (!newImage) throw new SkipRecordError("No NewImage found in record");

  const newStatus = newImage.sonicSummaryStatus?.S;
  const oldStatus = oldImage?.sonicSummaryStatus?.S;

  if (newStatus !== "PENDING")
    throw new SkipRecordError(`Skipping record with new status: ${newStatus}`);
  if (oldStatus === "PENDING")
    throw new SkipRecordError(
      "Already PENDING in old image — not a transition"
    );

  const meetingId = newImage.id?.S;
  const owner = newImage.owner?.S;
  if (!meetingId || !owner) {
    throw new SkipRecordError(
      `Missing required fields: ${JSON.stringify({ meetingId, owner })}`
    );
  }

  return { meetingId, owner };
};
