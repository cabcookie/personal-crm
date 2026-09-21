import { computeMeetingHeader, loadMeeting } from "./lib/render";
import { updateItemAttributes } from "./lib/ddb-write";

/**
 * Meeting-header Lambda.
 *
 * Invoked by a one-time EventBridge schedule ~5 minutes after the meeting's
 * topic/time, its participants, or an @-mention in any of its activities'
 * notes last changed (or synchronously by the Export-for-AI path). Caches the
 * context-free `meetingHeaderMarkdown` (date + topic, participants, deduped
 * people-mentioned) on the Meeting.
 *
 * Payload: `{ meetingId: string }`.
 */

type Event = { meetingId?: string };

/** Exported so the Export-for-AI path can run it inline (no scheduler). */
export const runMeetingHeader = async (meetingId: string): Promise<void> => {
  const meeting = await loadMeeting(meetingId);
  if (!meeting) {
    console.warn(`[meeting-header] meeting ${meetingId} not found; skipping`);
    return;
  }
  const owner = meeting.owner;
  if (!owner) {
    console.warn(
      `[meeting-header] meeting ${meetingId} has no owner; skipping`
    );
    return;
  }

  const header = await computeMeetingHeader(meeting, { owner });

  await updateItemAttributes(
    "Meeting",
    meetingId,
    {
      meetingHeaderMarkdown: header,
      meetingHeaderMarkdownUpdatedAt: new Date().toISOString(),
    },
    owner
  );

  console.log(`[meeting-header] wrote header for meeting ${meetingId}`, {
    length: header.length,
  });
};

export const handler = async (event: Event): Promise<void> => {
  const { meetingId } = event;
  if (!meetingId) {
    console.warn("[meeting-header] no meetingId in event; skipping");
    return;
  }
  await runMeetingHeader(meetingId);
};
