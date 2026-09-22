import type { SQSHandler, SQSBatchResponse } from "aws-lambda";
import { runPersonEmbedding } from "./lib/run-person-embedding";

/**
 * Person-embedding backfill: worker step.
 *
 * One SQS message = one Person id. Delegates to the shared runPersonEmbedding
 * core with clearPending, which embeds "Name (Company, Role)" (skipping the
 * Bedrock call when the source is unchanged) and clears the sparse
 * `nameEmbeddingPending` marker so the person leaves the work queue.
 * Idempotent, so at-least-once SQS redelivery is safe. Failed messages are
 * reported individually so only they retry / hit the DLQ.
 */

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const { personId } = JSON.parse(record.body) as { personId?: string };
      if (!personId) continue;
      await runPersonEmbedding(personId, { clearPending: true });
    } catch (error) {
      console.error("[backfill-person-embed-worker] message failed", {
        messageId: record.messageId,
        error,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
