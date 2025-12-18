import { uploadToS3 } from "./s3-upload";
import { updateTaskStatus } from "./update-task";
import { ExportStatus } from "../../../graphql-code/API";
import { client } from "./get-client";
import type { ExportTask } from "./load-task-record";
import { updateRecurringExport } from "../../../graphql-code/mutations";

/**
 * Handle recurring export: upload to S3 and update records
 */
export async function handleRecurringExport(
  task: ExportTask,
  result: string
): Promise<void> {
  if (!task.recurringExportId) {
    throw new Error("Task does not have a recurringExportId");
  }

  console.log("Processing recurring export", {
    taskId: task.id,
    recurringExportId: task.recurringExportId,
  });

  // Upload to S3
  const s3Key = await uploadToS3(result, task.owner, task.recurringExportId);

  // Update ExportTask with S3 key and COMPLETED status
  await updateTaskStatus(task.id, undefined, ExportStatus.COMPLETED, s3Key);

  // Update RecurringExport with the new S3 key
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
