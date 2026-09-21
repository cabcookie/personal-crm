import { defineFunction } from "@aws-amplify/backend";

/**
 * Debounced project-summary pipeline.
 *
 * - scheduleDebounce: triggered by DynamoDB Streams on NoteBlock and Activity.
 *   Creates/overwrites a one-time EventBridge schedule per activity so that
 *   the snapshot (5 min) and summary (6 min) run only after a quiet period.
 * - generateActivitySnapshot: renders an activity's note blocks to markdown
 *   and caches it on the Activity (fired by the 5-min schedule).
 * - generateProjectSummary: renders the whole project and asks Bedrock for a
 *   400-word prose summary (fired by the 6-min schedule).
 * - describeNoteImage: triggered by DynamoDB Stream on NoteBlock for s3image
 *   blocks; calls Bedrock vision and writes the description back.
 */

export const scheduleDebounce = defineFunction({
  name: "schedule-debounce",
  entry: "./schedule-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});

export const generateActivitySnapshot = defineFunction({
  name: "generate-activity-snapshot",
  entry: "./snapshot-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 5 * 60,
  logging: { retention: "1 week" },
});

export const generateProjectSummary = defineFunction({
  name: "generate-project-summary",
  entry: "./summary-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 5 * 60,
  logging: { retention: "1 week" },
});

export const generateMeetingHeader = defineFunction({
  name: "generate-meeting-header",
  entry: "./meeting-header-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 5 * 60,
  logging: { retention: "1 week" },
});

export const describeNoteImage = defineFunction({
  name: "describe-note-image",
  entry: "./image-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 3 * 60,
  logging: { retention: "1 week" },
});

/**
 * One-off image-description backfill (manually triggered).
 *
 * backfillImagesEnqueue pages the sparse `imageDescriptionPending` GSI and
 * fans block ids out to SQS; backfillImagesWorker consumes them with capped
 * concurrency and generates the descriptions. See
 * custom/backend/project-summary.ts for the SQS + concurrency wiring.
 */
export const backfillImagesEnqueue = defineFunction({
  name: "backfill-images-enqueue",
  entry: "./backfill-enqueue-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});

export const backfillImagesWorker = defineFunction({
  name: "backfill-images-worker",
  entry: "./backfill-worker-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 3 * 60,
  logging: { retention: "1 week" },
});

/**
 * One-off activity-snapshot backfill (manually triggered).
 *
 * backfillSnapshotsEnqueue pages the sparse `listSnapshotPending` GSI on
 * ProjectActivity (sorted by projectsId, so work flows project-by-project) and
 * fans junction rows out to SQS; backfillSnapshotsWorker consumes them and,
 * per row: runs the activity snapshot, fills the meeting header if missing,
 * and arms the project's summary scheduler. See custom/backend/
 * project-summary.ts for the SQS + concurrency wiring.
 */
export const backfillSnapshotsEnqueue = defineFunction({
  name: "backfill-snapshots-enqueue",
  entry: "./backfill-snapshots-enqueue-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});

export const backfillSnapshotsWorker = defineFunction({
  name: "backfill-snapshots-worker",
  entry: "./backfill-snapshots-worker-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 5 * 60,
  logging: { retention: "1 week" },
});
