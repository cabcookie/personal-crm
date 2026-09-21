import {
  DynamoDBClient,
  QueryCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * Activity-snapshot backfill: enqueue step.
 *
 * Pages the sparse `listSnapshotPending` GSI on ProjectActivity (only rows the
 * backfill script marked live there; sorted by projectsId, so work flows
 * project-by-project) and pushes each junction row onto the backfill SQS
 * queue. Self-invokes with the DynamoDB pagination cursor whenever it nears
 * its time budget, so no single invocation runs long.
 *
 * Env (via CDK):
 *  - DDB_TABLE_PROJECTACTIVITY   ProjectActivity physical table name
 *  - BACKFILL_SNAPSHOTS_QUEUE_URL  SQS queue url
 * (AWS_LAMBDA_FUNCTION_NAME is provided by the runtime, used for self-invoke.)
 *
 * Payload: `{ cursor?: <ExclusiveStartKey> }`.
 */

// Physical GSI name is auto-derived from the key schema by Amplify; the
// schema's queryField("listSnapshotPending") only names the GraphQL field.
const PENDING_INDEX = "projectActivitiesBySnapshotPendingAndProjectsId";
const PENDING_VALUE = "1";
const PAGE_SIZE = 100;
const TIME_BUDGET_MS = 45_000;

const ddb = new DynamoDBClient({});
const sqs = new SQSClient({});
const lambda = new LambdaClient({});

const env = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
};

type Cursor = Record<string, AttributeValue> | undefined;
type Event = { cursor?: Cursor };

type Row = {
  id: string;
  activityId: string;
  projectsId: string;
  owner: string;
};

const sendBatch = async (queueUrl: string, rows: Row[]): Promise<void> => {
  for (let i = 0; i < rows.length; i += 10) {
    const chunk = rows.slice(i, i + 10);
    await sqs.send(
      new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: chunk.map((row, j) => ({
          Id: `${i + j}`,
          MessageBody: JSON.stringify(row),
        })),
      })
    );
  }
};

export const handler = async (event: Event): Promise<void> => {
  const tableName = env("DDB_TABLE_PROJECTACTIVITY");
  const queueUrl = env("BACKFILL_SNAPSHOTS_QUEUE_URL");
  const selfName = env("AWS_LAMBDA_FUNCTION_NAME");

  const started = Date.now();
  let cursor: Cursor = event.cursor;
  let enqueued = 0;

  do {
    const page = await ddb.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: PENDING_INDEX,
        KeyConditionExpression: "#p = :p",
        // "owner" is a reserved word -> aliased as #o.
        ExpressionAttributeNames: { "#p": "snapshotPending", "#o": "owner" },
        ExpressionAttributeValues: { ":p": { S: PENDING_VALUE } },
        ProjectionExpression: "id, activityId, projectsId, #o",
        Limit: PAGE_SIZE,
        ExclusiveStartKey: cursor,
      })
    );

    const rows = (page.Items ?? [])
      .map((item) => unmarshall(item) as Partial<Row>)
      .filter(
        (r): r is Row => !!r.id && !!r.activityId && !!r.projectsId && !!r.owner
      );
    if (rows.length) {
      await sendBatch(queueUrl, rows);
      enqueued += rows.length;
    }

    cursor = page.LastEvaluatedKey as Cursor;

    if (cursor && Date.now() - started > TIME_BUDGET_MS) {
      console.log(
        `[backfill-snapshots-enqueue] time budget hit after ${enqueued} enqueued; continuing`
      );
      await lambda.send(
        new InvokeCommand({
          FunctionName: selfName,
          InvocationType: "Event",
          Payload: Buffer.from(JSON.stringify({ cursor })),
        })
      );
      return;
    }
  } while (cursor);

  console.log(`[backfill-snapshots-enqueue] done; enqueued ${enqueued} row(s)`);
};
