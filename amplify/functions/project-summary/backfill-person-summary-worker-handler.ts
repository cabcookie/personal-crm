import type { SQSHandler, SQSBatchResponse } from "aws-lambda";
import { runPersonSummary } from "./lib/run-person-summary";

/**
 * Person-summary backfill: worker step.
 *
 * One SQS message = one Person id. Delegates to the shared runPersonSummary
 * core with clearPending, which writes the summary (skipping people without
 * activity or with an unchanged context) and clears the sparse
 * `personSummaryPending` marker. Idempotent, so at-least-once SQS redelivery
 * is safe. Failed messages are reported individually so only they retry / hit
 * the DLQ.
 */

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const { personId } = JSON.parse(record.body) as { personId?: string };
      if (!personId) continue;
      await runPersonSummary(personId, { clearPending: true });
    } catch (error) {
      console.error("[backfill-person-summary-worker] message failed", {
        messageId: record.messageId,
        error,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
