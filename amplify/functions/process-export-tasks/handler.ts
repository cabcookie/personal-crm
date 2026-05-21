import type { DynamoDBStreamHandler } from "aws-lambda";
import { processExport } from "./fetching";
import { getItemRaw, loadTaskRecord, SkipRecordError } from "./helpers";
import { handleOneTimeExport } from "./helpers/handle-one-time-export";
import { handleRecurringExport } from "./helpers/handle-recurring-export";
import { markTaskAsFailed } from "./helpers/update-task";

const errorMessage = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : JSON.stringify(error);

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log("Processing DynamoDB Stream event", {
    recordCount: event.Records.length,
  });

  for (const record of event.Records) {
    let taskId: string | undefined;
    try {
      const task = loadTaskRecord(record);
      taskId = task.id;

      // For recurring tasks, AppSync strips `::username` off the owner field
      // on IAM writes, so `task.owner` is the single sub. The data tables
      // (Account, Projects, ...) store owners as `sub::username`, so tenant
      // checks in the reader would drop every record. Recover the raw owner
      // by reading the RecurringExport directly from DynamoDB.
      if (task.recurringExportId) {
        const recurring = await getItemRaw<{ owner?: string }>(
          "RecurringExport",
          task.recurringExportId
        );
        if (recurring?.owner) {
          task.owner = recurring.owner;
        } else {
          console.warn(
            `Could not resolve raw owner for recurring export ${task.recurringExportId}; tenant filter will likely drop every record`
          );
        }
      }

      const result = await processExport(task);

      console.log("Exported markdown:", result);

      const resultSizeBytes = Buffer.byteLength(result, "utf8");
      console.log("Export generated:", {
        taskId: task.id,
        sizeBytes: resultSizeBytes,
        sizeKB: Math.round(resultSizeBytes / 1024),
        isRecurring: !!task.recurringExportId,
      });

      // Handle recurring exports: upload to S3 and update RecurringExport record
      if (task.recurringExportId) {
        await handleRecurringExport(task, result);
      } else {
        await handleOneTimeExport(task, result);
      }
    } catch (error) {
      if (error instanceof SkipRecordError) {
        console.warn(error.message);
        continue;
      }
      console.error("Error processing export", error);
      if (taskId) {
        await markTaskAsFailed(taskId, errorMessage(error));
      }
    }
  }
};
