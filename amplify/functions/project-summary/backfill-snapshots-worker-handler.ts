import type { SQSHandler, SQSBatchResponse } from "aws-lambda";
import { runActivitySnapshot } from "./snapshot-handler";
import { runMeetingHeader } from "./meeting-header-handler";
import { loadActivity, loadMeeting } from "./lib/render";
import { updateItemAttributes } from "./lib/ddb-write";
import { upsertOneTimeSchedule, SUMMARY_DELAY_MINUTES } from "./lib/scheduler";

/**
 * Activity-snapshot backfill: worker step.
 *
 * One SQS message = one ProjectActivity junction row
 * `{ id, activityId, projectsId, owner }`. Per message it:
 *   1. runs the activity snapshot (writes notesMarkdown + activityHeaderMarkdown);
 *   2. if the activity belongs to a meeting that has NO cached header yet,
 *      generates the meeting header once (re-encountering the same meeting via
 *      another row is a no-op);
 *   3. arms the project's summary scheduler (debounced, so many rows of one
 *      project coalesce into a single summary run);
 *   4. clears the `snapshotPending` marker on THIS junction row.
 *
 * Idempotent: re-processing a row simply re-runs the (deterministic) snapshot
 * and re-arms the summary, so at-least-once redelivery is safe. Concurrency is
 * capped in CDK. Failed messages are reported individually (partial batch).
 */

type Row = {
  id: string;
  activityId: string;
  projectsId: string;
  owner: string;
};

const fillMeetingHeaderIfMissing = async (meetingId: string): Promise<void> => {
  const meeting = await loadMeeting(meetingId);
  const existing = (meeting as { meetingHeaderMarkdown?: string | null } | null)
    ?.meetingHeaderMarkdown;
  if (existing && existing.trim()) return; // already has a header — skip
  await runMeetingHeader(meetingId);
};

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
  const batchItemFailures: { itemIdentifier: string }[] = [];

  for (const record of event.Records) {
    try {
      const row = JSON.parse(record.body) as Partial<Row>;
      if (!row.id || !row.activityId || !row.projectsId || !row.owner) {
        console.warn("[backfill-snapshots-worker] malformed row; skipping", {
          body: record.body,
        });
        continue;
      }

      // 1. Snapshot the activity (writes notesMarkdown + activityHeaderMarkdown).
      await runActivitySnapshot(row.activityId);

      // 2. Meeting header, only if the activity is meeting-linked and the
      //    meeting has no cached header yet.
      const activity = await loadActivity(row.activityId);
      const meetingId = activity?.meetingActivitiesId ?? null;
      if (meetingId) await fillMeetingHeaderIfMissing(meetingId);

      // 3. Arm the project's summary (debounced; coalesces per project).
      await upsertOneTimeSchedule({
        kind: "summary",
        id: row.projectsId,
        delayMinutes: SUMMARY_DELAY_MINUTES,
      });

      // 4. Clear the marker on this junction row.
      await updateItemAttributes(
        "ProjectActivity",
        row.id,
        { snapshotPending: undefined },
        row.owner
      );

      console.log("[backfill-snapshots-worker] processed row", {
        activityId: row.activityId,
        projectsId: row.projectsId,
        meetingId,
      });
    } catch (error) {
      console.error("[backfill-snapshots-worker] message failed", {
        messageId: record.messageId,
        error,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
