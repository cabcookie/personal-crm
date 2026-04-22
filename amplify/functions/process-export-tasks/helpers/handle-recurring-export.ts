import { env } from "$amplify/env/process-export-tasks";
import { uploadToS3 } from "./s3-upload";
import { updateTaskStatus } from "./update-task";
import { ExportStatus } from "../../../graphql-code/API";
import { client } from "./get-client";
import type { ExportTask } from "./load-task-record";
import { updateRecurringExport } from "../../../graphql-code/mutations";

/**
 * Handle recurring export: upload to the dedicated recurring-exports bucket
 * and update records. The dedicated bucket lets us safely grant external
 * grantees (Quick Suite, etc.) bucket-wide read access without exposing any
 * other user data.
 *
 * Key shape: `exports/<identityId>/<recurringExportId>/latest.md`
 * (the `exports/` prefix is required — Amplify's storage access rules
 * reject `{entity_id}` as the first path segment).
 */
export async function handleRecurringExport(
  task: ExportTask,
  result: string
): Promise<void> {
  if (!task.recurringExportId) {
    throw new Error("Task does not have a recurringExportId");
  }

  if (!task.identityId) {
    throw new Error(
      `ExportTask ${task.id} (recurring) is missing identityId; cannot produce a path the caller can read`
    );
  }

  console.log("Processing recurring export", {
    taskId: task.id,
    recurringExportId: task.recurringExportId,
  });

  const key = `exports/${task.identityId}/${task.recurringExportId}/latest.md`;
  const s3Key = await uploadToS3({
    markdown: result,
    bucket: env.RECURRING_EXPORTS_BUCKET_NAME,
    key,
  });

  await updateTaskStatus(task.id, undefined, ExportStatus.COMPLETED, s3Key);

  await client.graphql({
    query: updateRecurringExport,
    variables: {
      input: {
        id: task.recurringExportId,
        s3Key,
      },
    },
  });

  console.log("Recurring export completed and uploaded to S3", {
    taskId: task.id,
    s3Key,
  });
}
