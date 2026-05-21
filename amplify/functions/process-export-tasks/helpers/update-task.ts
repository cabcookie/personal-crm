import { client } from "./get-client";
import { updateExportTask } from "../../../graphql-code/mutations";
import { ExportStatus } from "../../../graphql-code/API";

export const updateTaskStatus = async (
  taskId: string,
  result: string | undefined,
  status: keyof typeof ExportStatus,
  s3Key?: string
): Promise<void> => {
  console.log("Updating task status", {
    taskId,
    status,
    hasS3Key: !!s3Key,
  });

  const { data, errors } = await client.graphql({
    query: updateExportTask,
    variables: {
      input: {
        id: taskId,
        status: ExportStatus[status],
        ...(result !== undefined && { result }),
        ...(s3Key && { s3Key }),
      },
    },
  });

  if (errors)
    throw new Error(
      `Failed updating export task status: ${errors.length > 0 ? errors.map((err) => err.message).join(", ") : JSON.stringify(errors)}`
    );

  if (!data)
    throw new Error(`Failed updating task with ID ${taskId} to ${status}`);
};

/**
 * Mark a task as failed so the frontend subscription fires the destructive
 * "Export failed" toast. Sets status to GENERATED (the terminal-for-one-time
 * state the listener watches) with a non-empty `error`. Swallows mutation
 * errors — this is the error path, we don't want to mask the original failure.
 */
export const markTaskAsFailed = async (
  taskId: string,
  error: string
): Promise<void> => {
  console.log("Marking task as failed", { taskId, error });
  try {
    await client.graphql({
      query: updateExportTask,
      variables: {
        input: {
          id: taskId,
          status: ExportStatus.GENERATED,
          error,
        },
      },
    });
  } catch (mutationError) {
    console.error("Failed to mark task as failed", { taskId, mutationError });
  }
};
