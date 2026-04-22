import {
  BatchGetItemCommand,
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent } from "https";

/**
 * Direct-to-DynamoDB data access for the export renderer.
 *
 * The Lambda previously fetched data exclusively through AppSync, which enforced
 * the schema's @auth(owner) rule server-side. These helpers bypass AppSync and
 * talk to DynamoDB directly, so tenant isolation must be enforced client-side:
 * every fetch takes an `owner` argument and drops records whose `owner`
 * attribute does not match. Drops are logged — non-zero counts indicate data
 * that would have previously been filtered by AppSync, and should be
 * investigated rather than ignored.
 */

const MAX_SOCKETS = 256;
const BATCH_GET_CHUNK_SIZE = 100;

const httpsAgent = new Agent({ maxSockets: MAX_SOCKETS, keepAlive: true });
const client = new DynamoDBClient({
  requestHandler: new NodeHttpHandler({ httpsAgent }),
});

const getTableName = (model: string): string => {
  const envKey = `DDB_TABLE_${model.toUpperCase()}`;
  const name = process.env[envKey];
  if (!name) {
    throw new Error(
      `Missing env ${envKey}. Add ${model} to EXPORT_READ_TABLES in custom/backend/export-tasks.ts.`
    );
  }
  return name;
};

export type DdbRecord = Record<string, unknown> & { owner?: string };

type OwnerOpts = { owner: string };

const matchesOwner = (record: DdbRecord, owner: string): boolean =>
  record.owner === owner;

/**
 * Fetch a single item by id without any owner filtering. Used only when the
 * caller's intent is to *resolve* the tenant (e.g. reading a RecurringExport
 * record to recover its raw `owner`, which AppSync's IAM-mode resolvers strip
 * the `::username` suffix off of). Never use this on data that is returned to
 * the export output — use `getItem` there.
 */
export const getItemRaw = async <T extends DdbRecord = DdbRecord>(
  model: string,
  id: string
): Promise<T | null> => {
  const TableName = getTableName(model);
  const res = await client.send(
    new GetItemCommand({ TableName, Key: { id: { S: id } } })
  );
  if (!res.Item) return null;
  return unmarshall(res.Item) as T;
};

/**
 * Fetch a single item by id. Returns null when the item is missing OR when its
 * owner does not match the caller — both look like "not found" to the renderer.
 */
export const getItem = async <T extends DdbRecord = DdbRecord>(
  model: string,
  id: string,
  { owner }: OwnerOpts
): Promise<T | null> => {
  const TableName = getTableName(model);
  const res = await client.send(
    new GetItemCommand({ TableName, Key: { id: { S: id } } })
  );
  if (!res.Item) return null;
  const obj = unmarshall(res.Item) as DdbRecord;
  if (!matchesOwner(obj, owner)) {
    console.warn(
      `[ddb] owner mismatch on ${model}/${id} — dropping record (expected owner=${owner})`
    );
    return null;
  }
  return obj as T;
};

/**
 * Query a GSI and return all matching items that belong to the caller. Uses a
 * FilterExpression on `owner` so non-matching items are dropped server-side
 * (still consumes RCUs, but avoids moving them into Lambda memory).
 */
export const queryByIndex = async <T extends DdbRecord = DdbRecord>(
  model: string,
  indexName: string,
  keyField: string,
  keyValue: string,
  { owner }: OwnerOpts
): Promise<T[]> => {
  const TableName = getTableName(model);
  const items: T[] = [];
  let ExclusiveStartKey: Record<string, any> | undefined;
  let dropped = 0;
  do {
    const res = await client.send(
      new QueryCommand({
        TableName,
        IndexName: indexName,
        KeyConditionExpression: "#k = :v",
        FilterExpression: "#o = :owner",
        ExpressionAttributeNames: { "#k": keyField, "#o": "owner" },
        ExpressionAttributeValues: {
          ":v": { S: keyValue },
          ":owner": { S: owner },
        },
        ExclusiveStartKey,
      })
    );
    if (res.Items)
      items.push(...(res.Items.map((item) => unmarshall(item)) as T[]));
    dropped += (res.ScannedCount ?? 0) - (res.Count ?? 0);
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  if (dropped > 0) {
    console.warn(
      `[ddb] ${dropped} record(s) dropped on ${model}.${indexName} due to owner filter (owner=${owner})`
    );
  }
  return items;
};

/**
 * Fetch up to N items by id in chunks of 100. BatchGetItem has no server-side
 * filter, so owner filtering happens after unmarshall. Returns a Map keyed by
 * the primary-key field (default "id") so callers can preserve caller-supplied
 * ordering.
 */
export const batchGetItems = async <T extends DdbRecord = DdbRecord>(
  model: string,
  ids: string[],
  { owner }: OwnerOpts,
  keyField = "id"
): Promise<Map<string, T>> => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, T>();
  if (!uniqueIds.length) return map;
  const TableName = getTableName(model);
  let dropped = 0;
  for (let i = 0; i < uniqueIds.length; i += BATCH_GET_CHUNK_SIZE) {
    const chunk = uniqueIds.slice(i, i + BATCH_GET_CHUNK_SIZE);
    let keys: Record<string, AttributeValue>[] = chunk.map((id) => ({
      [keyField]: { S: id },
    }));
    while (keys.length) {
      const res = await client.send(
        new BatchGetItemCommand({
          RequestItems: { [TableName]: { Keys: keys } },
        })
      );
      for (const item of res.Responses?.[TableName] ?? []) {
        const obj = unmarshall(item) as DdbRecord;
        if (!matchesOwner(obj, owner)) {
          dropped++;
          continue;
        }
        map.set(obj[keyField] as string, obj as T);
      }
      keys = res.UnprocessedKeys?.[TableName]?.Keys ?? [];
    }
  }
  if (dropped > 0) {
    console.warn(
      `[ddb] ${dropped} record(s) dropped on ${model} batch-get due to owner filter (owner=${owner})`
    );
  }
  return map;
};
