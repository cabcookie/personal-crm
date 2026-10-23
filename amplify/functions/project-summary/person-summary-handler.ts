import { runPersonSummary } from "./lib/run-person-summary";

/**
 * Person-summary Lambda.
 *
 * Invoked by a one-time EventBridge schedule ~10 minutes after the last
 * change to anything the summary depends on (learnings, employments,
 * relationships, meeting participation, mentions, notes of their meetings).
 * Keyed by personId, so bursts of changes coalesce into one run.
 *
 * Payload: `{ personId: string }`.
 */

type Event = { personId?: string };

export const handler = async (event: Event): Promise<void> => {
  if (!event.personId) {
    console.warn("[person-summary] no personId in event; skipping");
    return;
  }
  await runPersonSummary(event.personId);
};
