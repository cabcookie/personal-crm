import {
  DynamoDBClient,
  QueryCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * Image-description backfill: enqueue step.
 *
 * Pages through the sparse `imageDescriptionPending` GSI on NoteBlock (only
 * blocks the backfill script marked as pending live there) and pushes each
 * block id onto the backfill SQS queue. To avoid ever running one long
 * invocation over thousands of rows, it self-invokes asynchronously with the
 * DynamoDB pagination cursor whenever it nears its time budget, so each
 * invocation handles a bounded slice.
 *
 * Env (injected via CDK):
 *  - DDB_TABLE_NOTEBLOCK          NoteBlock physical table name
 *  - BACKFILL_QUEUE_URL           SQS queue url
 * (AWS_LAMBDA_FUNCTION_NAME is provided automatically by the runtime and is
 *  used for the self-invoke.)
 *
 * Payload: `{ cursor?: <ExclusiveStartKey> }`.
 */

// Physical GSI name is auto-derived from the key schema by Amplify; the
// schema's queryField("listImageDescriptionPending") only names the GraphQL
// field.
const PENDING_INDEX = "noteBlocksByImageDescriptionPending";
const PENDING_VALUE = "1";
const PAGE_SIZE = 100;
// Stop and hand off to a fresh invocation once we've used this much wall time,
// leaving headroom under the function timeout.
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

const sendBatch = async (queueUrl: string, ids: string[]): Promise<void> => {
  // SQS SendMessageBatch caps at 10 entries.
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    await sqs.send(
      new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: chunk.map((id, j) => ({
          Id: `${i + j}`,
          MessageBody: JSON.stringify({ blockId: id }),
        })),
      })
    );
  }
};

export const handler = async (event: Event): Promise<void> => {
  const tableName = env("DDB_TABLE_NOTEBLOCK");
  const queueUrl = env("BACKFILL_QUEUE_URL");
  // AWS_LAMBDA_FUNCTION_NAME is injected by the Lambda runtime, so we don't
  // have to pass our own name via env — doing that would make the function's
  // definition reference its own generated name and create a CloudFormation
  // circular dependency.
  const selfName = env("AWS_LAMBDA_FUNCTION_NAME");

  const started = Date.now();
  let cursor: Cursor = event.cursor;
  let enqueued = 0;

  do {
    const res = await ddb.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: PENDING_INDEX,
        KeyConditionExpression: "#p = :p",
        ExpressionAttributeNames: { "#p": "imageDescriptionPending" },
        ExpressionAttributeValues: { ":p": { S: PENDING_VALUE } },
        ProjectionExpression: "id",
        Limit: PAGE_SIZE,
        ExclusiveStartKey: cursor,
      })
    );

    const ids = (res.Items ?? [])
      .map((item) => item.id?.S)
      .filter((id): id is string => !!id);
    if (ids.length) {
      await sendBatch(queueUrl, ids);
      enqueued += ids.length;
    }

    cursor = res.LastEvaluatedKey as Cursor;

    // Hand off to a fresh invocation rather than risk the timeout.
    if (cursor && Date.now() - started > TIME_BUDGET_MS) {
      console.log(
        `[backfill-enqueue] time budget hit after ${enqueued} enqueued; continuing in a new invocation`
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

  console.log(`[backfill-enqueue] done; enqueued ${enqueued} block(s)`);
};
