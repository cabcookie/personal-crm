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
