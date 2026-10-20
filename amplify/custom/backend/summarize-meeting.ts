import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { CfnScheduleGroup } from "aws-cdk-lib/aws-scheduler";

/**
 * Wires the `summarize-meeting` Lambda: a DynamoDB stream on the Meeting
 * table triggers it whenever `sonicSummaryStatus` transitions to "PENDING"
 * (the Lambda itself filters MODIFY-to-PENDING — see lib/load-record.ts);
 * read access (direct DynamoDB, bypassing AppSync, same convention as
 * project-summary.ts / export-tasks.ts) to resolve the meeting's topics and
 * participants; write access to the Meeting table for the result; and Bedrock
 * access for Claude Sonnet.
 */
const SONNET = "anthropic.claude-sonnet-5-5";

// Tables read directly to resolve a meeting's topics (Activity ->
// ProjectActivity -> Projects -> Account) and participants (MeetingParticipant
// -> Person -> PersonAccount -> Account), plus User to resolve the owner's own
// linked Person.
const READ_TABLES = [
  "Activity",
  "ProjectActivity",
  "Projects",
  "Account",
  "MeetingParticipant",
  "Person",
  "PersonAccount",
  "User",
];

// Tables the summary is written INTO when transferred into topic notes:
// Activity (append to noteBlockIds), and the note-content models. These need
// PutItem (new NoteBlock/Todo/NoteBlockPerson rows) and UpdateItem (Activity).
// Each also needs a DDB_TABLE_<NAME> env (some overlap with READ_TABLES,
// addEnvironment is idempotent for the same key/value).
const WRITE_TABLES = ["Activity", "NoteBlock", "Todo", "NoteBlockPerson"];

export function setupSummarizeMeeting(backend: BackendType) {
  const fn = backend.summarizeMeeting.resources.lambda;
  const stack = Stack.of(fn);
  const meetingTable = backend.data.resources.tables["Meeting"];

  /* ---------------------------------------------------------------- *
   * Trigger: Meeting table stream -> summarize-meeting (filtered to the
   * sonicSummaryStatus -> PENDING transition inside the handler).
   * ---------------------------------------------------------------- */
  meetingTable.grantStreamRead(fn);
  fn.addEventSource(
    new DynamoEventSource(meetingTable, {
      startingPosition: StartingPosition.LATEST,
      batchSize: 10,
      retryAttempts: 3,
      bisectBatchOnError: true,
    })
  );

  /* ---------------------------------------------------------------- *
   * Read access: direct DynamoDB reads for topics + participants.
   * ---------------------------------------------------------------- */
  const readResources: string[] = [];
  for (const name of READ_TABLES) {
    const table = backend.data.resources.tables[name];
    if (!table) {
      throw new Error(
        `setupSummarizeMeeting: table "${name}" not found in data resources`
      );
    }
    readResources.push(table.tableArn, `${table.tableArn}/index/*`);
    backend.summarizeMeeting.addEnvironment(
      `DDB_TABLE_${name.toUpperCase()}`,
      table.tableName
    );
  }
  fn.addToRolePolicy(
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

  /* ---------------------------------------------------------------- *
   * Meeting record access: read it (loadMeeting -> GetItem, to recover
   * sonicTranscript / sonicMentionedPersonIds / owner) and write the result
   * back (sonicSummary + sonicSummaryStatus + sonicSummaryError).
   * ---------------------------------------------------------------- */
  backend.summarizeMeeting.addEnvironment(
    "DDB_TABLE_MEETING",
    meetingTable.tableName
  );
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
      resources: [meetingTable.tableArn],
    })
  );

  /* ---------------------------------------------------------------- *
   * Write access: transfer the finished summary into topic notes.
   * Activity gets UpdateItem (append noteBlockIds); the note-content models
   * get PutItem (new rows). Read access for these already comes from
   * READ_TABLES where they overlap (Activity); the rest only need write +
   * their table-name env.
   * ---------------------------------------------------------------- */
  const writeResources: string[] = [];
  for (const name of WRITE_TABLES) {
    const table = backend.data.resources.tables[name];
    if (!table) {
      throw new Error(
        `setupSummarizeMeeting: table "${name}" not found in data resources`
      );
    }
    writeResources.push(table.tableArn);
    backend.summarizeMeeting.addEnvironment(
      `DDB_TABLE_${name.toUpperCase()}`,
      table.tableName
    );
  }
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"],
      resources: writeResources,
    })
  );

  /* ---------------------------------------------------------------- *
   * Bedrock: Claude Sonnet, US cross-region inference profile.
   * ---------------------------------------------------------------- */
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["bedrock:InvokeModel"],
      resources: [
        `arn:aws:bedrock:${stack.region}:${stack.account}:inference-profile/us.${SONNET}`,
        `arn:aws:bedrock:us-east-1::foundation-model/${SONNET}`,
        `arn:aws:bedrock:us-east-2::foundation-model/${SONNET}`,
        `arn:aws:bedrock:us-west-2::foundation-model/${SONNET}`,
      ],
    })
  );

  /* ---------------------------------------------------------------- *
   * Transcript auto-delete: a one-time EventBridge Scheduler schedule armed
   * after a summary is produced fires 24h later into the
   * delete-meeting-transcript Lambda, which removes sonicTranscript from the
   * Meeting record. Same one-time-schedule pattern as project-summary.ts.
   * ---------------------------------------------------------------- */
  const deleteFn = backend.deleteMeetingTranscript.resources.lambda;

  // delete-meeting-transcript needs to UpdateItem (REMOVE) on the Meeting table.
  backend.deleteMeetingTranscript.addEnvironment(
    "DDB_TABLE_MEETING",
    meetingTable.tableName
  );
  deleteFn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [meetingTable.tableArn],
    })
  );

  const scheduleGroup = new CfnScheduleGroup(
    stack,
    "TranscriptDeleteScheduleGroup",
    {}
  );
  const scheduleGroupName = scheduleGroup.ref;
  const deleteTargetArn = deleteFn.functionArn;

  const schedulerRole = new iam.Role(stack, "TranscriptDeleteSchedulerRole", {
    assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
    description:
      "Role EventBridge Scheduler assumes to invoke the delete-meeting-transcript Lambda",
  });
  schedulerRole.addToPolicy(
    new iam.PolicyStatement({
      actions: ["lambda:InvokeFunction"],
      resources: [deleteTargetArn],
    })
  );

  // summarize-meeting arms/updates the schedules and passes the scheduler role.
  fn.addToRolePolicy(
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
  fn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["iam:PassRole"],
      resources: [schedulerRole.roleArn],
      conditions: {
        StringEquals: { "iam:PassedToService": "scheduler.amazonaws.com" },
      },
    })
  );

  backend.summarizeMeeting.addEnvironment(
    "TRANSCRIPT_DELETE_SCHEDULE_GROUP_NAME",
    scheduleGroupName
  );
  backend.summarizeMeeting.addEnvironment(
    "TRANSCRIPT_DELETE_SCHEDULER_ROLE_ARN",
    schedulerRole.roleArn
  );
  backend.summarizeMeeting.addEnvironment(
    "TRANSCRIPT_DELETE_TARGET_ARN",
    deleteTargetArn
  );
}
