import { updateItemAttributes } from "../project-summary/lib/ddb-write";

/**
 * EventBridge Scheduler one-time target. Input shape mirrors what
 * summarize-meeting's scheduler helper writes:
 *   { "meetingId": "...", "owner": "sub::username" }
 *
 * Removes the live transcript from the Meeting record. Owner-guarded so a
 * record whose owner doesn't match is never touched (defence in depth —
 * matches the write-side convention in ddb-write.ts). REMOVE (not NULL) so
 * the attribute truly goes away.
 */
type Event = { meetingId?: string; owner?: string };

export const handler = async (event: Event): Promise<void> => {
  const { meetingId, owner } = event;
  if (!meetingId || !owner) {
    console.warn(
      `[delete-meeting-transcript] missing meetingId/owner: ${JSON.stringify(event)}`
    );
    return;
  }
  await updateItemAttributes(
    "Meeting",
    meetingId,
    {
      sonicTranscript: undefined,
      sonicTranscriptUpdatedAt: undefined,
    },
    owner
  );
  console.log(
    `[delete-meeting-transcript] removed transcript from meeting ${meetingId}`
  );
};
