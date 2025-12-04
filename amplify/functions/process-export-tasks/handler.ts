import { DynamoDBStreamHandler } from "aws-lambda";
import { loadTaskRecord, SkipRecordError, updateTaskStatus } from "./helpers";
import { processExport } from "./fetching";
import { ExportStatus } from "../../graphql-code/API";

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log("Processing DynamoDB Stream event", {
    recordCount: event.Records.length,
  });

  for (const record of event.Records) {
    try {
      const task = loadTaskRecord(record);
      const result = await processExport(task);
      await updateTaskStatus(task.id, result, ExportStatus.GENERATED);
      console.log("Export completed successfully", { taskId: task.id });
    } catch (error) {
      if (error instanceof SkipRecordError) {
        console.warn(error.message);
        continue;
      }
      console.error("Error processing export", error);
    }
  }
};
