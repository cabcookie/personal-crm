import { runProjectEmbedding } from "./lib/run-project-embedding";

/**
 * Project embedding Lambda (online path).
 *
 * Invoked by a one-time EventBridge schedule ~2 minutes after the last change
 * to a Project's name or summary, keyed by projectId so rapid edits coalesce
 * into one run. Delegates to the shared runProjectEmbedding core (also used by
 * the one-off backfill worker).
 *
 * Payload: `{ projectId: string }`.
 */

type Event = { projectId?: string };

export const handler = async (event: Event): Promise<void> => {
  const { projectId } = event;
  if (!projectId) {
    console.warn("[project-embedding] no projectId in event; skipping");
    return;
  }
  await runProjectEmbedding(projectId);
};
