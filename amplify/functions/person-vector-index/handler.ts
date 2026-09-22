import {
  DynamoDBClient,
  DescribeTableCommand,
  UpdateTableCommand,
} from "@aws-sdk/client-dynamodb";

/**
 * CloudFormation custom-resource handler that ensures the DynamoDB vector
 * index on Person.nameEmbedding exists — idempotently.
 *
 * Why a Lambda instead of AwsCustomResource: CDK doesn't model vector indexes,
 * and a plain updateTable custom resource can't check "does it already exist?"
 * — so it breaks in two ways: (1) it errors if the index is already there, and
 * (2) it does NOT re-run when Amplify drops & recreates the Person table on a
 * secondary-index change (the table comes back WITHOUT the vector index, but
 * the custom resource's physical id is unchanged, so CFN never re-invokes it).
 *
 * This handler runs on Create AND Update, calls DescribeTable, and only issues
 * updateTable when the index is missing. That makes it safe to re-run on every
 * deploy and self-healing after a table recreate. Delete is a no-op (dropping a
 * vector index on a live table is deliberately left as a manual action).
 *
 * Env: DDB_TABLE_PERSON, VECTOR_INDEX_NAME, VECTOR_ATTRIBUTE, VECTOR_DIMENSIONS.
 */

const ddb = new DynamoDBClient({});

type CfnEvent = {
  RequestType: "Create" | "Update" | "Delete";
};

const env = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env ${key}`);
  return value;
};

const ensureIndex = async (): Promise<string> => {
  const TableName = env("DDB_TABLE_PERSON");
  const IndexName = env("VECTOR_INDEX_NAME");
  const AttributeName = env("VECTOR_ATTRIBUTE");
  const Dimensions = parseInt(env("VECTOR_DIMENSIONS"), 10);

  const desc = await ddb.send(new DescribeTableCommand({ TableName }));
  const existing = (desc.Table?.VectorIndexes ?? []).some(
    (vi) => vi.IndexName === IndexName
  );
  if (existing) {
    console.log(`[person-vector-index] ${IndexName} already exists; no-op`);
    return "exists";
  }

  console.log(`[person-vector-index] creating ${IndexName} on ${TableName}`);
  await ddb.send(
    new UpdateTableCommand({
      TableName,
      VectorIndexUpdates: [
        {
          Create: {
            IndexName,
            VectorAttribute: { AttributeName },
            Dimensions,
            DistanceFunction: "COSINE",
            // No SearchSchema: an owner HASH/INLINE_FILTER would have to be a
            // declared table AttributeDefinition (it isn't on this Amplify
            // table). Tenant isolation is enforced in the search resolver,
            // which post-filters by the caller's owner.
            Projection: { ProjectionType: "ALL" },
          },
        },
      ],
    })
  );
  return "created";
};

export const handler = async (event: CfnEvent): Promise<void> => {
  console.log("[person-vector-index] event", event.RequestType);
  if (event.RequestType === "Delete") return; // no-op, see header
  await ensureIndex();
};
