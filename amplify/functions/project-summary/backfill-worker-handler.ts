import type { SQSHandler, SQSBatchResponse } from "aws-lambda";
import { getItemRaw } from "../process-export-tasks/helpers/dynamodb";
import {
  describeAndPersist,
  extractS3Key,
  getBucket,
  type NoteBlockImage,
} from "./lib/describe-image";
import { updateItemAttributes } from "./lib/ddb-write";

/**
 * Image-description backfill: worker step.
 *
 * One SQS message = one NoteBlock id. Reads the block, and if it is an
 * `s3image` still lacking a description, generates one via Bedrock vision and
 * writes it back, clearing the `imageDescriptionPending` marker. Idempotent:
 * blocks that are already described (or no longer images) just clear their
 * marker and succeed, so at-least-once redelivery is safe.
 *
 * Concurrency is capped via reserved concurrency in CDK to stay within Bedrock
 * rate limits. Failed messages are reported individually so only they retry /
 * land in the DLQ (partial batch response).
 */

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const bucket = getBucket();
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const { blockId } = JSON.parse(record.body) as { blockId?: string };
      if (!blockId) continue;

      const block = await getItemRaw<NoteBlockImage>("NoteBlock", blockId);
      if (!block) {
        console.warn(`[backfill-worker] block ${blockId} not found; skipping`);
        continue;
      }

      // Already done, or not an image: just clear the marker so it leaves the
      // work queue, and move on.
      const alreadyDescribed =
        block.imageDescription && block.imageDescription.trim();
      if (
        block.type !== "s3image" ||
        alreadyDescribed ||
        !extractS3Key(block)
      ) {
        await updateItemAttributes(
          "NoteBlock",
          blockId,
          { imageDescriptionPending: undefined },
          block.owner
        );
        continue;
      }

      const description = await describeAndPersist(block, bucket, {
        clearPending: true,
      });
      console.log(`[backfill-worker] described block ${blockId}`, {
        length: description?.length ?? 0,
      });
    } catch (error) {
      console.error("[backfill-worker] message failed", {
        messageId: record.messageId,
        error,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
