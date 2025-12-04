import type { BackendType } from "../../backend";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";

/**
 * Configure export tasks functionality:
 * - TTL for auto-deletion after 7 days
 * - DynamoDB Stream to trigger Lambda on new tasks
 */
export function setupExportTasks(backend: BackendType) {
  const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
  const exportTaskTable = backend.data.resources.tables["ExportTask"];

  /**
   * Configure TTL for ExportTask table to auto-delete after 7 days
   */
  amplifyDynamoDbTables["ExportTask"].timeToLiveAttribute = {
    attributeName: "ttl",
    enabled: true,
  };

  /**
   * Configure DynamoDB Stream for ExportTask table to trigger Lambda
   */
  // Grant stream read and write permissions
  exportTaskTable.grantStreamRead(backend.processExportTasks.resources.lambda);
  exportTaskTable.grantWriteData(backend.processExportTasks.resources.lambda);

  // Add DynamoDB Stream as event source
  backend.processExportTasks.resources.lambda.addEventSource(
    new DynamoEventSource(exportTaskTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 10,
      retryAttempts: 3,
      bisectBatchOnError: true,
    })
  );
}
