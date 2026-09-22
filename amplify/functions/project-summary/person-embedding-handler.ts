import { runPersonEmbedding } from "./lib/run-person-embedding";

/**
 * Person embedding Lambda (online path).
 *
 * Invoked by a one-time EventBridge schedule ~2 minutes after the last change
 * to a Person (or their PersonAccount employment), keyed by personId so rapid
 * edits coalesce into one run. Delegates to the shared runPersonEmbedding core
 * (also used by the one-off backfill worker).
 *
 * Payload: `{ personId: string }`.
 */

type Event = { personId?: string };

export const handler = async (event: Event): Promise<void> => {
  const { personId } = event;
  if (!personId) {
    console.warn("[person-embedding] no personId in event; skipping");
    return;
  }
  await runPersonEmbedding(personId);
};
