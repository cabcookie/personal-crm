import type { BackendType } from "../../backend";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Bucket, type CfnBucket } from "aws-cdk-lib/aws-s3";

/**
 * Configure export tasks functionality:
 * - TTL for auto-deletion after 7 days
 * - DynamoDB Stream to trigger Lambda on new tasks
 * - EventBridge schedule for recurring exports
 * - S3 permissions for export storage
 * - Permission management for cross-account access
 * - Direct DynamoDB read access for the export renderer
 */

// Model tables the processExportTasks Lambda reads directly (bypassing AppSync).
// Writes still go through AppSync so the @auth(owner) rule is enforced server-side.
// On reads, the Lambda must filter every fetched record by the ExportTask's
// `owner` — there is no AppSync layer to enforce tenant isolation here.
const EXPORT_READ_TABLES = [
  "Account",
  "AccountLearning",
  "AccountProjects",
  "Projects",
  "ProjectActivity",
  "Activity",
  "NoteBlock",
  "Todo",
  "Meeting",
  "MeetingParticipant",
  "Person",
  "PersonAccount",
  // RecurringExport is read raw (no owner filter) to recover the original
  // sub::username owner format, which AppSync strips on IAM reads.
  "RecurringExport",
];
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
   * 5. Grant S3 object access + inject bucket-name env vars for the two
   *    Lambdas that talk to S3.
   *
   *    Everything is wired via CDK instead of `allow.resource(...)` in
   *    storage/resource.ts because the declarative path creates a circular
   *    dependency between the storage stack and the function stacks (the
   *    storage stack would import the function resources).
   *
   *    Env var names mirror Amplify's auto-injection convention:
   *      <STORAGE_NAME>_BUCKET_NAME (UPPER_SNAKE_CASE).
   */
  const recurringExportsBucket = backend.recurringExports.resources.bucket;

  // processExportTasks — writes both one-time exports (default bucket) and
  // recurring exports (recurring-exports bucket).
  s3Bucket.grantReadWrite(backend.processExportTasks.resources.lambda);
  backend.processExportTasks.addEnvironment(
    "STORAGE_BUCKET_NAME",
    s3Bucket.bucketName
  );
  recurringExportsBucket.grantReadWrite(
    backend.processExportTasks.resources.lambda
  );
  backend.processExportTasks.addEnvironment(
    "RECURRING_EXPORTS_BUCKET_NAME",
    recurringExportsBucket.bucketName
  );

  /**
   * 6. manageExportPermissions only edits the bucket policy on the
   *    recurring-exports bucket — no object-level access needed. Bucket-level
   *    policy actions aren't expressible through storage access rules so
   *    they come through CDK.
   */
  backend.manageExportPermissions.addEnvironment(
    "RECURRING_EXPORTS_BUCKET_NAME",
    recurringExportsBucket.bucketName
  );
  backend.manageExportPermissions.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["s3:PutBucketPolicy", "s3:GetBucketPolicy"],
      resources: [recurringExportsBucket.bucketArn],
    })
  );

  /**
   * 8. Grant direct DynamoDB read access to processExportTasks Lambda
   * The rendering path reads model tables and GSIs directly via the AWS SDK
   * instead of going through AppSync. Each resolved physical table name is
   * exposed to the Lambda as a DDB_TABLE_<MODEL> env var so the Lambda
   * doesn't need to reconstruct it from an apiId.
   *
   * We attach an explicit IAM policy covering both the table ARN and
   * `tableArn/index/*` — Amplify's AmplifyDynamoDbTable construct's
   * grantReadData does not reliably propagate index access, so we grant
   * explicitly to cover GSI Query calls like accountLearningsByAccountId,
   * gsi-Meeting.participants, gsi-Person.accounts, etc.
   */
  const ddbReadResources: string[] = [];
  for (const name of EXPORT_READ_TABLES) {
    const table = backend.data.resources.tables[name];
    if (!table) {
      throw new Error(
        `setupExportTasks: table "${name}" not found in data resources`
      );
    }
    ddbReadResources.push(table.tableArn, `${table.tableArn}/index/*`);
    backend.processExportTasks.addEnvironment(
      `DDB_TABLE_${name.toUpperCase()}`,
      table.tableName
    );
  }
  backend.processExportTasks.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:BatchGetItem",
        "dynamodb:Query",
        "dynamodb:DescribeTable",
      ],
      resources: ddbReadResources,
    })
  );

  /**
   * 9. Add S3 lifecycle policy for one-time exports
   * Auto-delete after 90 days to match extended retention period
   */
  if (!(s3Bucket instanceof Bucket))
    throw new Error("bucket is not an instance of Bucket");

  const cfnBucket = s3Bucket.node.defaultChild as CfnBucket;

  cfnBucket.addOverride("Properties.LifecycleConfiguration", {
    Rules: [
      {
        Id: "delete-exports-after-90-days",
        Status: "Enabled",
        Prefix: "exports/",
        ExpirationInDays: 90,
      },
    ],
  });
}
