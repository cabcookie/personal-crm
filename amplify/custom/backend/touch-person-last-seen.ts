import type { BackendType } from "../../backend";
import * as iam from "aws-cdk-lib/aws-iam";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";

/**
 * Wire the touch-person-last-seen Lambda to the MeetingParticipant and
 * NoteBlockPerson DynamoDB streams, and let it UpdateItem on the Person table.
 *
 * Follows the same conventions as custom/backend/project-summary.ts: the table
 * name is exposed to the Lambda as `DDB_TABLE_PERSON`, IAM is granted
 * explicitly in CDK (no FGAC — the Lambda is a trusted backend writer and only
 * advances `lastSeen`), and stream sources use LATEST with small batches.
 */
export function setupTouchPersonLastSeen(backend: BackendType) {
  const touchFn = backend.touchPersonLastSeen.resources.lambda;

  const personTable = backend.data.resources.tables["Person"];
  const meetingParticipantTable =
    backend.data.resources.tables["MeetingParticipant"];
  const noteBlockPersonTable = backend.data.resources.tables["NoteBlockPerson"];

  backend.touchPersonLastSeen.addEnvironment(
    "DDB_TABLE_PERSON",
    personTable.tableName
  );

  // Write access: advance Person.lastSeen only.
  touchFn.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:UpdateItem"],
      resources: [personTable.tableArn],
    })
  );

  // Stream sources: a person added as a meeting participant, or @-mentioned in
  // a note block. Only INSERTs matter (handled in the handler).
  for (const table of [meetingParticipantTable, noteBlockPersonTable]) {
    table.grantStreamRead(touchFn);
    touchFn.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 10,
        retryAttempts: 3,
        bisectBatchOnError: true,
      })
    );
  }
}
