import type { BackendType } from "../../backend";
import {
  DynamoEventSource,
  SqsEventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import type { CfnFunction } from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnScheduleGroup } from "aws-cdk-lib/aws-scheduler";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { ArnFormat, Duration, Stack } from "aws-cdk-lib";

/**
 * Wires the debounced project-summary pipeline.
 *
 * Data flow:
 *   NoteBlock change ─┬─▶ scheduleDebounce ──▶ (EventBridge one-time schedule, 5m)
 *                     │                          └▶ generateActivitySnapshot
 *                     │                               └─ writes Activity.notesMarkdown
 *                     └─▶ describeNoteImage (s3image only) ─ writes NoteBlock.imageDescription
 *
 *   Activity.notesMarkdown change ─▶ scheduleDebounce ──▶ (one-time schedule, 6m)
 *                                                          └▶ generateProjectSummary
 *                                                               └─ writes Projects.projectSummary
 *
 * Follows the same conventions as custom/backend/export-tasks.ts: direct-DDB
 * reads/writes (bypassing AppSync to preserve the `sub::username` owner
 * format), table names exposed to the Lambdas as `DDB_TABLE_<MODEL>` env vars,
 * and IAM granted explicitly in CDK to avoid storage/function stack cycles.
 */

// Tables the snapshot + summary Lambdas READ directly (via the reused export
// helpers). Every read is owner-filtered in the Lambda.
const READ_TABLES = [
  "Activity",
  "NoteBlock",
  "Todo",
  "ProjectActivity",
  "Projects",
  "AccountProjects",
  "Account",
  "Meeting",
  "MeetingParticipant",
  "Person",
  "PersonAccount",
];

// Sonnet 4.5 (US cross-region inference profile). Mirrors the ids in
// amplify/data/models.ts. InvokeModel must be granted on both the inference
// profile and the underlying foundation models in every routed region.
const SONNET_45 = "anthropic.claude-sonnet-4-5-20250929-v1:0";

const bedrockInvokeStatement = (stack: Stack): iam.PolicyStatement =>
  new iam.PolicyStatement({
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:${stack.region}:${stack.account}:inference-profile/us.${SONNET_45}`,
      `arn:aws:bedrock:us-east-1::foundation-model/${SONNET_45}`,
      `arn:aws:bedrock:us-east-2::foundation-model/${SONNET_45}`,
      `arn:aws:bedrock:us-west-2::foundation-model/${SONNET_45}`,
    ],
  });

const injectReadTables = (
  fn: { addEnvironment: (k: string, v: string) => void; resources: any },
  backend: BackendType
): void => {
  const readResources: string[] = [];
  for (const name of READ_TABLES) {
    const table = backend.data.resources.tables[name];
    if (!table) {
      throw new Error(
        `setupProjectSummary: table "${name}" not found in data resources`
      );
    }
    readResources.push(table.tableArn, `${table.tableArn}/index/*`);
    fn.addEnvironment(`DDB_TABLE_${name.toUpperCase()}`, table.tableName);
  }
  fn.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:BatchGetItem",
        "dynamodb:Query",
        "dynamodb:DescribeTable",
      ],
      resources: readResources,
    })
  );
};

export function setupProjectSummary(backend: BackendType) {
  const noteBlockTable = backend.data.resources.tables["NoteBlock"];
  const activityTable = backend.data.resources.tables["Activity"];
  const projectsTable = backend.data.resources.tables["Projects"];

  const {
    scheduleDebounce,
    generateActivitySnapshot,
    generateProjectSummary,
    generateMeetingHeader,
    describeNoteImage,
    backfillImagesEnqueue,
    backfillImagesWorker,
    backfillSnapshotsEnqueue,
    backfillSnapshotsWorker,
  } = backend;

  const stack = Stack.of(scheduleDebounce.resources.lambda);

  /* ------------------------------------------------------------------ *
   * 1. DynamoDB stream: NoteBlock -> scheduleDebounce + describeNoteImage
   * ------------------------------------------------------------------ */
  noteBlockTable.grantStreamRead(scheduleDebounce.resources.lambda);
  scheduleDebounce.resources.lambda.addEventSource(
    new DynamoEventSource(noteBlockTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 10,
      retryAttempts: 3,
      bisectBatchOnError: true,
    })
  );

  noteBlockTable.grantStreamRead(describeNoteImage.resources.lambda);
  describeNoteImage.resources.lambda.addEventSource(
    new DynamoEventSource(noteBlockTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 5,
      retryAttempts: 3,
      bisectBatchOnError: true,
    })
  );

  /* ------------------------------------------------------------------ *
   * 2. Additional streams into scheduleDebounce so header caches stay fresh:
   *      Meeting            -> meeting-header (topic/time changed)
   *      MeetingParticipant -> meeting-header (participants changed)
   *      ProjectActivity    -> activity snapshot + summary (links changed)
   *    scheduleDebounce also reads the ProjectActivity junction (gsi-Activity.
   *    forProjects) and the Activity table (to resolve an activity's meeting).
   * ------------------------------------------------------------------ */
  const projectActivityTable = backend.data.resources.tables["ProjectActivity"];
  const meetingTable = backend.data.resources.tables["Meeting"];
  const meetingParticipantTable =
    backend.data.resources.tables["MeetingParticipant"];

  for (const [model, table] of [
    ["PROJECTACTIVITY", projectActivityTable],
    ["ACTIVITY", activityTable],
  ] as const) {
    scheduleDebounce.addEnvironment(`DDB_TABLE_${model}`, table.tableName);
  }
  scheduleDebounce.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:Query", "dynamodb:GetItem"],
      resources: [
        projectActivityTable.tableArn,
        `${projectActivityTable.tableArn}/index/*`,
        activityTable.tableArn,
      ],
    })
  );

  // Stream sources that feed the meeting-header + activity re-arming.
  for (const table of [
    meetingTable,
    meetingParticipantTable,
    projectActivityTable,
  ]) {
    table.grantStreamRead(scheduleDebounce.resources.lambda);
    scheduleDebounce.resources.lambda.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 10,
        retryAttempts: 3,
        bisectBatchOnError: true,
      })
    );
  }

  /* ------------------------------------------------------------------ *
   * 3. EventBridge Scheduler: group + role Scheduler assumes to invoke
   *    the two target Lambdas.
   * ------------------------------------------------------------------ */
  // Let CloudFormation auto-generate the group name. Deriving it from
  // `stack.stackName` produced a name > 64 chars: stackName is an unresolved
  // token at synth time, so `.slice(0, 64)` ran on the token placeholder, not
  // the real (already long) sandbox stack name. `scheduleGroup.ref` gives us
  // the generated name for the env var and IAM ARN.
  const scheduleGroup = new CfnScheduleGroup(
    stack,
    "ProjectSummaryScheduleGroup",
    {}
  );
  const scheduleGroupName = scheduleGroup.ref;

  const snapshotArn = generateActivitySnapshot.resources.lambda.functionArn;
  const summaryArn = generateProjectSummary.resources.lambda.functionArn;
  const meetingHeaderArn = generateMeetingHeader.resources.lambda.functionArn;

  const schedulerRole = new iam.Role(stack, "ProjectSummarySchedulerRole", {
    assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
    description:
      "Role EventBridge Scheduler assumes to invoke the snapshot/summary/meeting-header Lambdas",
  });
  schedulerRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ["lambda:InvokeFunction"],
      resources: [snapshotArn, summaryArn, meetingHeaderArn],
    })
  );

  // scheduleDebounce needs to create/update/delete schedules in the group and
  // pass the scheduler role to the schedules it creates.
  scheduleDebounce.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: [
        "scheduler:CreateSchedule",
        "scheduler:UpdateSchedule",
        "scheduler:DeleteSchedule",
        "scheduler:GetSchedule",
      ],
      resources: [
        `arn:aws:scheduler:${stack.region}:${stack.account}:schedule/${scheduleGroupName}/*`,
      ],
    })
  );
  scheduleDebounce.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["iam:PassRole"],
      resources: [schedulerRole.roleArn],
      conditions: {
        StringEquals: { "iam:PassedToService": "scheduler.amazonaws.com" },
      },
    })
  );

  scheduleDebounce.addEnvironment("SCHEDULE_GROUP_NAME", scheduleGroupName);
  scheduleDebounce.addEnvironment("SCHEDULER_ROLE_ARN", schedulerRole.roleArn);
  scheduleDebounce.addEnvironment("SNAPSHOT_TARGET_ARN", snapshotArn);
  scheduleDebounce.addEnvironment("SUMMARY_TARGET_ARN", summaryArn);
  scheduleDebounce.addEnvironment(
    "MEETING_HEADER_TARGET_ARN",
    meetingHeaderArn
  );

  /* ------------------------------------------------------------------ *
   * 4. Snapshot Lambda: read tables + write Activity.notesMarkdown.
   * ------------------------------------------------------------------ */
  injectReadTables(generateActivitySnapshot, backend);
  generateActivitySnapshot.addEnvironment(
    "DDB_TABLE_ACTIVITY",
    activityTable.tableName
  );
  generateActivitySnapshot.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [activityTable.tableArn],
    })
  );

  /* ------------------------------------------------------------------ *
   * 5. Summary Lambda: read tables + write Projects.projectSummary +
   *    invoke Bedrock.
   * ------------------------------------------------------------------ */
  injectReadTables(generateProjectSummary, backend);
  generateProjectSummary.addEnvironment(
    "DDB_TABLE_PROJECTS",
    projectsTable.tableName
  );
  generateProjectSummary.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [projectsTable.tableArn],
    })
  );
  generateProjectSummary.resources.lambda.addToRolePolicy(
    bedrockInvokeStatement(stack)
  );

  /* ------------------------------------------------------------------ *
   * 5b. Meeting-header Lambda: read tables + write Meeting.
   *     meetingHeaderMarkdown. No Bedrock (pure formatting).
   * ------------------------------------------------------------------ */
  injectReadTables(generateMeetingHeader, backend);
  generateMeetingHeader.addEnvironment(
    "DDB_TABLE_MEETING",
    meetingTable.tableName
  );
  generateMeetingHeader.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [meetingTable.tableArn],
    })
  );

  /* ------------------------------------------------------------------ *
   * 6. Image-description Lambda: read image from S3, write
   *    NoteBlock.imageDescription, invoke Bedrock vision.
   * ------------------------------------------------------------------ */
  const s3Bucket = backend.storage.resources.bucket;
  s3Bucket.grantRead(describeNoteImage.resources.lambda);
  describeNoteImage.addEnvironment("STORAGE_BUCKET_NAME", s3Bucket.bucketName);
  describeNoteImage.addEnvironment(
    "DDB_TABLE_NOTEBLOCK",
    noteBlockTable.tableName
  );
  describeNoteImage.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [noteBlockTable.tableArn],
    })
  );
  describeNoteImage.resources.lambda.addToRolePolicy(
    bedrockInvokeStatement(stack)
  );

  /* ------------------------------------------------------------------ *
   * 7. One-off image-description backfill: SQS queue + DLQ, enqueue &
   *    worker Lambdas. Concurrency is deliberately small to respect
   *    Bedrock rate limits on the first run.
   * ------------------------------------------------------------------ */
  const backfillDlq = new Queue(stack, "ImageBackfillDlq", {
    retentionPeriod: Duration.days(14),
  });
  const backfillQueue = new Queue(stack, "ImageBackfillQueue", {
    // Must be >= worker timeout; the worker is 3 min, give it headroom.
    visibilityTimeout: Duration.minutes(6),
    deadLetterQueue: { maxReceiveCount: 3, queue: backfillDlq },
  });

  // Enqueue: read the sparse GSI + fan ids to SQS + self-invoke to paginate.
  backfillImagesEnqueue.addEnvironment(
    "DDB_TABLE_NOTEBLOCK",
    noteBlockTable.tableName
  );
  backfillImagesEnqueue.addEnvironment(
    "BACKFILL_QUEUE_URL",
    backfillQueue.queueUrl
  );
  // Explicit read policy incl. /index/* (grantReadData doesn't reliably cover
  // GSIs on AmplifyDynamoDbTable); the enqueue queries listImageDescriptionPending.
  backfillImagesEnqueue.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:Query", "dynamodb:GetItem"],
      resources: [
        noteBlockTable.tableArn,
        `${noteBlockTable.tableArn}/index/*`,
      ],
    })
  );
  backfillQueue.grantSendMessages(backfillImagesEnqueue.resources.lambda);
  // Self-invoke permission for the pagination hand-off. We must NOT use
  // `grantInvoke(self)` here: that puts the function's ARN into its own role's
  // default policy while the function already depends on that role, producing
  // a CloudFormation circular dependency. Granting on a stack-scoped wildcard
  // ARN (a plain string, not a resource reference) breaks the cycle while
  // still covering this function.
  backfillImagesEnqueue.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["lambda:InvokeFunction"],
      resources: [
        Stack.of(backfillImagesEnqueue.resources.lambda).formatArn({
          service: "lambda",
          resource: "function",
          resourceName: "*",
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        }),
      ],
    })
  );

  // Worker: consume SQS, read image from S3, describe via Bedrock, write back.
  s3Bucket.grantRead(backfillImagesWorker.resources.lambda);
  backfillImagesWorker.addEnvironment(
    "STORAGE_BUCKET_NAME",
    s3Bucket.bucketName
  );
  backfillImagesWorker.addEnvironment(
    "DDB_TABLE_NOTEBLOCK",
    noteBlockTable.tableName
  );
  backfillImagesWorker.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
      resources: [noteBlockTable.tableArn],
    })
  );
  backfillImagesWorker.resources.lambda.addToRolePolicy(
    bedrockInvokeStatement(stack)
  );
  backfillImagesWorker.resources.lambda.addEventSource(
    new SqsEventSource(backfillQueue, {
      batchSize: 5,
      reportBatchItemFailures: true,
    })
  );
  // Cap concurrency for the first backfill run so we stay well under Bedrock
  // rate limits. Tune upward once the pilot looks healthy in CloudWatch.
  (
    backfillImagesWorker.resources.lambda.node.defaultChild as CfnFunction
  ).reservedConcurrentExecutions = 2;

  /* ------------------------------------------------------------------ *
   * 8. One-off activity-snapshot backfill: SQS queue + DLQ, enqueue &
   *    worker Lambdas. Worker runs the same render functions as the
   *    schedulers (snapshot + meeting-header) and arms each project's
   *    summary timer. Concurrency capped for Bedrock (meeting header is
   *    pure formatting, but summaries fire downstream).
   * ------------------------------------------------------------------ */
  const snapshotBackfillDlq = new Queue(stack, "SnapshotBackfillDlq", {
    retentionPeriod: Duration.days(14),
  });
  const snapshotBackfillQueue = new Queue(stack, "SnapshotBackfillQueue", {
    // >= worker timeout (5 min) with headroom.
    visibilityTimeout: Duration.minutes(6),
    deadLetterQueue: { maxReceiveCount: 3, queue: snapshotBackfillDlq },
  });

  // Enqueue: page the sparse listSnapshotPending GSI + fan rows to SQS.
  backfillSnapshotsEnqueue.addEnvironment(
    "DDB_TABLE_PROJECTACTIVITY",
    projectActivityTable.tableName
  );
  backfillSnapshotsEnqueue.addEnvironment(
    "BACKFILL_SNAPSHOTS_QUEUE_URL",
    snapshotBackfillQueue.queueUrl
  );
  // Explicit read policy incl. /index/* — Amplify's AmplifyDynamoDbTable
  // grantReadData does not reliably propagate GSI access (same caveat as the
  // export reader), and the enqueue queries the listSnapshotPending GSI.
  backfillSnapshotsEnqueue.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:Query", "dynamodb:GetItem"],
      resources: [
        projectActivityTable.tableArn,
        `${projectActivityTable.tableArn}/index/*`,
      ],
    })
  );
  snapshotBackfillQueue.grantSendMessages(
    backfillSnapshotsEnqueue.resources.lambda
  );
  backfillSnapshotsEnqueue.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["lambda:InvokeFunction"],
      resources: [
        Stack.of(backfillSnapshotsEnqueue.resources.lambda).formatArn({
          service: "lambda",
          resource: "function",
          resourceName: "*",
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        }),
      ],
    })
  );

  // Worker: run the snapshot + (conditional) meeting header, arm the summary,
  // clear the marker. Needs the same read tables the render functions use,
  // write access to Activity/Meeting/ProjectActivity, and scheduler access.
  injectReadTables(backfillSnapshotsWorker, backend);
  backfillSnapshotsWorker.addEnvironment(
    "DDB_TABLE_ACTIVITY",
    activityTable.tableName
  );
  backfillSnapshotsWorker.addEnvironment(
    "DDB_TABLE_MEETING",
    meetingTable.tableName
  );
  backfillSnapshotsWorker.addEnvironment(
    "DDB_TABLE_PROJECTACTIVITY",
    projectActivityTable.tableName
  );
  backfillSnapshotsWorker.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [
        activityTable.tableArn,
        meetingTable.tableArn,
        projectActivityTable.tableArn,
      ],
    })
  );
  // Scheduler access to arm each project's summary (same group + role as
  // scheduleDebounce).
  backfillSnapshotsWorker.addEnvironment(
    "SCHEDULE_GROUP_NAME",
    scheduleGroupName
  );
  backfillSnapshotsWorker.addEnvironment(
    "SCHEDULER_ROLE_ARN",
    schedulerRole.roleArn
  );
  backfillSnapshotsWorker.addEnvironment("SUMMARY_TARGET_ARN", summaryArn);
  backfillSnapshotsWorker.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: [
        "scheduler:CreateSchedule",
        "scheduler:UpdateSchedule",
        "scheduler:GetSchedule",
      ],
      resources: [
        `arn:aws:scheduler:${stack.region}:${stack.account}:schedule/${scheduleGroupName}/*`,
      ],
    })
  );
  backfillSnapshotsWorker.resources.lambda.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["iam:PassRole"],
      resources: [schedulerRole.roleArn],
      conditions: {
        StringEquals: { "iam:PassedToService": "scheduler.amazonaws.com" },
      },
    })
  );
  backfillSnapshotsWorker.resources.lambda.addEventSource(
    new SqsEventSource(snapshotBackfillQueue, {
      batchSize: 5,
      reportBatchItemFailures: true,
    })
  );
  (
    backfillSnapshotsWorker.resources.lambda.node.defaultChild as CfnFunction
  ).reservedConcurrentExecutions = 2;
}
