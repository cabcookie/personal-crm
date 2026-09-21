import type { DynamoDBStreamHandler } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  describeAndPersist,
  extractS3Key,
  getBucket,
  type NoteBlockImage,
} from "./lib/describe-image";

/**
 * Generate an AI description for image note blocks (live path).
 *
 * Fires on the NoteBlock DynamoDB stream. For each INSERT/MODIFY of an
 * `s3image` block that does not yet have an `imageDescription`, it downloads
 * the image from S3, asks Bedrock (Sonnet 4.5, vision) to describe it, and
 * writes the description back onto the NoteBlock. The description later flows
 * into the activity markdown via `renderBlocks`.
 *
 * The one-off backfill uses the same `describeAndPersist` core via an SQS
 * worker; this handler does not touch the backfill marker.
 */

export const handler: DynamoDBStreamHandler = async (event) => {
  const bucket = getBucket();

  for (const record of event.Records) {
    if (record.eventName !== "INSERT" && record.eventName !== "MODIFY")
      continue;

    const image = record.dynamodb?.NewImage;
    if (!image) continue;

    const block = unmarshall(
      image as Record<string, AttributeValue>
    ) as NoteBlockImage;

    if (block.type !== "s3image") continue;
    // Idempotency: skip blocks that already carry a description so MODIFY
    // events from our own write-back (or unrelated edits) don't re-invoke the
    // model. Re-describing requires clearing imageDescription first.
    if (block.imageDescription && block.imageDescription.trim()) continue;

    if (!extractS3Key(block)) {
      console.warn(
        `[image] s3image block ${block.id} has no s3Key/fileKey; skipping`
      );
      continue;
    }

    try {
      const description = await describeAndPersist(block, bucket);
      console.log(`[image] described block ${block.id}`, {
        length: description?.length ?? 0,
      });
    } catch (error) {
      // Swallow per-record errors so one bad image doesn't poison the batch.
      console.error(`[image] failed to describe block ${block.id}`, { error });
    }
  }
};
