import type { SQSHandler, SQSBatchResponse } from "aws-lambda";
import { runProjectEmbedding } from "./lib/run-project-embedding";

/**
 * Project-embedding backfill: worker step.
 *
 * One SQS message = one Project id. Delegates to the shared runProjectEmbedding
 * core with clearPending, which embeds "<name> — <first summary section>"
 * (skipping the Bedrock call when the source is unchanged) and clears the
 * sparse `summaryEmbeddingPending` marker so the project leaves the work queue.
 * Idempotent, so at-least-once SQS redelivery is safe. Failed messages are
 * reported individually so only they retry / hit the DLQ.
 */

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const { projectId } = JSON.parse(record.body) as { projectId?: string };
      if (!projectId) continue;
      await runProjectEmbedding(projectId, { clearPending: true });
    } catch (error) {
      console.error("[backfill-project-embed-worker] message failed", {
        messageId: record.messageId,
        error,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
