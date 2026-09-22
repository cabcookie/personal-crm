import {
  DynamoDBClient,
  QueryCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

/**
 * Person-embedding backfill: enqueue step.
 *
 * Pages the sparse `nameEmbeddingPending` GSI on Person (only rows the mark
 * script flagged) and pushes each person id onto the backfill SQS queue.
 * Self-invokes with the DynamoDB pagination cursor when it nears its time
 * budget, so no single invocation runs long. Mirrors the image-description
 * backfill enqueue handler.
 *
 * Env (via CDK):
 *  - DDB_TABLE_PERSON               Person physical table name
 *  - BACKFILL_PERSON_EMBED_QUEUE_URL  SQS queue url
 * (AWS_LAMBDA_FUNCTION_NAME is provided by the runtime, used for self-invoke.)
 *
 * Payload: `{ cursor?: <ExclusiveStartKey> }`.
 */

// Physical GSI name is auto-derived from the key schema by Amplify; the
// schema's queryField("listNameEmbeddingPending") only names the GraphQL
// field. Verify with describe-table after the first deploy if the query fails.
const PENDING_INDEX = "peopleByNameEmbeddingPending";
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

const sendBatch = async (queueUrl: string, ids: string[]): Promise<void> => {
  // SQS SendMessageBatch caps at 10 entries.
  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    await sqs.send(
      new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: chunk.map((id, j) => ({
          Id: `${i + j}`,
          MessageBody: JSON.stringify({ personId: id }),
        })),
      })
    );
  }
};

export const handler = async (event: Event): Promise<void> => {
  const tableName = env("DDB_TABLE_PERSON");
  const queueUrl = env("BACKFILL_PERSON_EMBED_QUEUE_URL");
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
        ExpressionAttributeNames: { "#p": "nameEmbeddingPending" },
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

    if (cursor && Date.now() - started > TIME_BUDGET_MS) {
      console.log(
        `[backfill-person-embed-enqueue] time budget hit after ${enqueued} enqueued; continuing`
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

  console.log(
    `[backfill-person-embed-enqueue] done; enqueued ${enqueued} person(s)`
  );
};
