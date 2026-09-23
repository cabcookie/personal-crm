import {
  DynamoDBClient,
  DescribeTableCommand,
  UpdateTableCommand,
} from "@aws-sdk/client-dynamodb";

/**
 * CloudFormation custom-resource handler that ensures the DynamoDB vector
 * index on Projects.summaryEmbedding exists — idempotently. Mirrors
 * ensure-person-vector-index (see that handler for the full rationale): runs on
 * Create AND Update, DescribeTable-checks, and only issues UpdateTable when the
 * index is missing — safe to re-run and self-healing after a table recreate.
 * Delete is a no-op.
 *
 * Env: DDB_TABLE_PROJECTS, VECTOR_INDEX_NAME, VECTOR_ATTRIBUTE, VECTOR_DIMENSIONS.
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
  const TableName = env("DDB_TABLE_PROJECTS");
  const IndexName = env("VECTOR_INDEX_NAME");
  const AttributeName = env("VECTOR_ATTRIBUTE");
  const Dimensions = parseInt(env("VECTOR_DIMENSIONS"), 10);

  const desc = await ddb.send(new DescribeTableCommand({ TableName }));
  const existing = (desc.Table?.VectorIndexes ?? []).some(
    (vi) => vi.IndexName === IndexName
  );
  if (existing) {
    console.log(`[project-vector-index] ${IndexName} already exists; no-op`);
    return "exists";
  }

  console.log(`[project-vector-index] creating ${IndexName} on ${TableName}`);
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
            // No SearchSchema: tenant isolation is enforced in the search
            // resolver (owner post-filter), same as the person index.
            Projection: { ProjectionType: "ALL" },
          },
        },
      ],
    })
  );
  return "created";
};

export const handler = async (event: CfnEvent): Promise<void> => {
  console.log("[project-vector-index] event", event.RequestType);
  if (event.RequestType === "Delete") return; // no-op, see header
  await ensureIndex();
};
