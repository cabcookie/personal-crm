import type { BackendType } from "../../backend";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

/**
 * Configure export tasks functionality:
 * - TTL for auto-deletion after 7 days
 * - DynamoDB Stream to trigger Lambda on new tasks
 * - EventBridge schedule for recurring exports
 * - S3 permissions for export storage
 * - Permission management for cross-account access
 */
export function setupExportTasks(backend: BackendType) {
  const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
  const exportTaskTable = backend.data.resources.tables["ExportTask"];
  const exportPermissionTable =
    backend.data.resources.tables["ExportPermission"];
  const s3Bucket = backend.storage.resources.bucket;

  /**
   * 1. Configure TTL for ExportTask table to auto-delete after 7 days
   */
  amplifyDynamoDbTables["ExportTask"].timeToLiveAttribute = {
    attributeName: "ttl",
    enabled: true,
  };

  /**
   * 2. Configure DynamoDB Stream for ExportTask table to trigger processExportTasks Lambda
   */
  // Grant stream read permissions (required for DynamoDB Streams)
  exportTaskTable.grantStreamRead(backend.processExportTasks.resources.lambda);

  // Add DynamoDB Stream as event source
  backend.processExportTasks.resources.lambda.addEventSource(
    new DynamoEventSource(exportTaskTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 10,
      retryAttempts: 3,
      bisectBatchOnError: true,
    })
  );

  /**
   * 3. Configure EventBridge schedule for recurring exports
   */
  const scheduleRule = new Rule(
    backend.scheduleRecurringExports.stack,
    "RecurringExportsScheduleRule",
    {
      schedule: Schedule.rate(Duration.minutes(15)),
      description: "Triggers recurring export scheduler every 15 minutes",
    }
  );

  scheduleRule.addTarget(
    new LambdaFunction(backend.scheduleRecurringExports.resources.lambda)
  );

  /**
   * 4. Configure DynamoDB Stream for ExportPermission table to trigger manageExportPermissions Lambda
   */
  // Stream read permission required for DynamoDB Stream trigger
  exportPermissionTable.grantStreamRead(
    backend.manageExportPermissions.resources.lambda
  );

  backend.manageExportPermissions.resources.lambda.addEventSource(
    new DynamoEventSource(exportPermissionTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 5,
      retryAttempts: 3,
    })
  );

  /**
   * 5. Grant S3 object access to processExportTasks Lambda
   * Note: Using CDK grants to avoid circular dependency between data and storage stacks
   */
  s3Bucket.grantReadWrite(backend.processExportTasks.resources.lambda);
  backend.processExportTasks.addEnvironment(
    "STORAGE_BUCKET_NAME",
    s3Bucket.bucketName
  );

  /**
   * 6. Grant S3 read access to manageExportPermissions Lambda
   * Note: Using CDK grants to avoid circular dependency between data and storage stacks
   */
  s3Bucket.grantRead(backend.manageExportPermissions.resources.lambda);

  /**
   * 7. Grant S3 bucket policy modification permissions to manageExportPermissions Lambda
   * Note: These CDK-level permissions are required because the Lambda modifies the bucket
   * policy itself (not individual objects), which cannot be done through storage authorization
   */
  backend.manageExportPermissions.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["s3:PutBucketPolicy", "s3:GetBucketPolicy"],
      resources: [s3Bucket.bucketArn],
    })
  );
}
