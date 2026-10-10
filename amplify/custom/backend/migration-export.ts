import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import type { CfnFunction } from "aws-cdk-lib/aws-lambda";

/**
 * Wiring for the migration-export Lambda (board 9q33.5a2k):
 *  - read-only access to the model tables it exports, exposed as
 *    DDB_TABLE_<MODEL> env vars (the Lambda filters every scan by owner),
 *  - read access to the user files and write access to the exports folder of
 *    the default bucket (granted via CDK for the same circular-dependency
 *    reason as in export-tasks.ts),
 *  - 10 GB of /tmp so the archive is assembled on disk, not in memory,
 *  - no async retries: a failed run writes an error marker instead, and a
 *    retry after a timeout would only produce a duplicate export.
 */
const MIGRATION_EXPORT_TABLES = [
  "User",
  "Person",
  "PersonDetail",
  "PersonAccount",
  "PersonRelationship",
  "PersonLearning",
  "Account",
  "AccountLearning",
  "AccountLearningPerson",
  "Projects",
  "AccountProjects",
  "Meeting",
  "MeetingParticipant",
  "Activity",
  "ProjectActivity",
  "NoteBlock",
  "Todo",
];

export function setupMigrationExport(backend: BackendType) {
  const fn = backend.migrationExport;
  const lambda = fn.resources.lambda;
  const bucket = backend.storage.resources.bucket;

  const tableArns: string[] = [];
  for (const name of MIGRATION_EXPORT_TABLES) {
    const table = backend.data.resources.tables[name];
    if (!table)
      throw new Error(
        `setupMigrationExport: table "${name}" not found in data resources`
      );
    tableArns.push(table.tableArn);
    fn.addEnvironment(`DDB_TABLE_${name.toUpperCase()}`, table.tableName);
  }
  lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:Scan", "dynamodb:GetItem"],
      resources: tableArns,
    })
  );

  bucket.grantRead(lambda, "user-files/*");
  bucket.grantReadWrite(lambda, "exports/*");
  bucket.grantDelete(lambda, "exports/*");
  fn.addEnvironment("STORAGE_BUCKET_NAME", bucket.bucketName);
  fn.addEnvironment("GIT_SHA", process.env.AWS_COMMIT_ID ?? "");

  (lambda.node.defaultChild as CfnFunction).ephemeralStorage = {
    size: 10240,
  };
  lambda.configureAsyncInvoke({ retryAttempts: 0 });
}
