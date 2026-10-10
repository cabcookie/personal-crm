import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

/**
 * DynamoDB and S3 access of the migration export. The Lambda reads the model
 * tables directly (no AppSync), so tenant isolation is enforced here: every
 * scan filters on the caller's `owner`.
 */

const ddb = new DynamoDBClient({});
const s3 = new S3Client({});

type Rec = Record<string, unknown>;

export const tableName = (model: string): string => {
  const key = `DDB_TABLE_${model.toUpperCase()}`;
  const name = process.env[key];
  if (!name)
    throw new Error(
      `Missing env ${key}. Add ${model} to MIGRATION_EXPORT_TABLES in custom/backend/migration-export.ts.`
    );
  return name;
};

const bucket = (): string => {
  const name = process.env.STORAGE_BUCKET_NAME;
  if (!name) throw new Error("Missing env STORAGE_BUCKET_NAME");
  return name;
};

/** All records of a model table that belong to `owner`. */
export const scanByOwner = async (
  model: string,
  owner: string
): Promise<Rec[]> => {
  const items: Rec[] = [];
  let ExclusiveStartKey: Record<string, AttributeValue> | undefined;
  do {
    const res = await ddb.send(
      new ScanCommand({
        TableName: tableName(model),
        FilterExpression: "#owner = :owner",
        ExpressionAttributeNames: { "#owner": "owner" },
        ExpressionAttributeValues: { ":owner": { S: owner } },
        ExclusiveStartKey,
      })
    );
    for (const item of res.Items ?? []) items.push(unmarshall(item));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
};

/** The `User` model is keyed by `profileId`, which equals the owner string. */
export const getUser = async (owner: string): Promise<Rec[]> => {
  const res = await ddb.send(
    new GetItemCommand({
      TableName: tableName("User"),
      Key: { profileId: { S: owner } },
    })
  );
  return res.Item ? [unmarshall(res.Item)] : [];
};

export type FetchedFile = {
  data: Buffer;
  mime: string | null;
};

/** Returns null when the object does not exist. */
export const fetchFile = async (key: string): Promise<FetchedFile | null> => {
  try {
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucket(), Key: key })
    );
    const bytes = await res.Body!.transformToByteArray();
    return { data: Buffer.from(bytes), mime: res.ContentType ?? null };
  } catch (error) {
    if (error instanceof NoSuchKey) return null;
    throw error;
  }
};

export const putJson = async (key: string, value: unknown): Promise<void> => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: JSON.stringify(value, null, 2),
      ContentType: "application/json",
    })
  );
};

export const putFile = async (
  key: string,
  path: string,
  contentType: string
): Promise<void> => {
  const { size } = await stat(path);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: createReadStream(path),
      ContentLength: size,
      ContentType: contentType,
    })
  );
};

export const deleteObject = async (key: string): Promise<void> => {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
};
