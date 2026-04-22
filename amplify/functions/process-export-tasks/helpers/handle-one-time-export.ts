import { env } from "$amplify/env/process-export-tasks";
import { ExportStatus } from "../../../graphql-code/API";
import type { ExportTask } from "./load-task-record";
import { uploadToS3 } from "./s3-upload";
import { updateTaskStatus } from "./update-task";

export const handleOneTimeExport = async (task: ExportTask, result: string) => {
  console.log("Processing one-time export", {
    taskId: task.id,
  });

  if (!task.identityId) {
    throw new Error(
      `ExportTask ${task.id} is missing identityId; cannot produce a path the caller can read`
    );
  }

  const key = `exports/${task.identityId}/one-time/${task.id}.md`;
  const s3Key = await uploadToS3({
    markdown: result,
    bucket: env.STORAGE_BUCKET_NAME,
    key,
  });

  await updateTaskStatus(task.id, undefined, ExportStatus.GENERATED, s3Key);

  console.log("One-time export completed and uploaded to S3", {
    taskId: task.id,
    s3Key,
  });
};
