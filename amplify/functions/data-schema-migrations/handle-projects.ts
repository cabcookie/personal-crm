import { marshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  ScanCommand,
  AttributeValue,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { env } from "$amplify/env/data-schema-migrations";

const ddb = new DynamoDBClient({});
const tableName = env.PROJECTS_TABLE_NAME;

export const listProjects = async (): Promise<
  Record<string, AttributeValue>[]
> => {
  try {
    console.log({ tableName });
    const response = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: "attribute_not_exists(pinned)",
        Limit: 5000,
      })
    );
    if (!response.Items) throw "No records found";
    return response.Items;
  } catch (error) {
    console.error("Error listing projects with no pinned value");
    throw error;
  }
};

export const updateProjects = async (
  projects: Record<string, AttributeValue>[]
) => {
  const chunkSize = 100;
  const unprocessed: WriteRequest[] = [];
  for (let i = 0; i < projects.length; i += chunkSize) {
    const chunk = projects.slice(i, i + chunkSize);
    const chunkResults = await ddb.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            PutRequest: {
              Item: {
                ...item,
                pinned: marshall({ pinned: "NOTPINNED" }).pinned,
              },
            },
          })),
        },
      })
    );

    if (
      chunkResults.UnprocessedItems &&
      chunkResults.UnprocessedItems[tableName]
    )
      unprocessed.push(...chunkResults.UnprocessedItems[tableName]);

    console.log(
      `Processed chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(projects.length / chunkSize)}`
    );

    // Pause for 1 second before processing next chunk (except for the last one)
    if (i + chunkSize < projects.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("Unprocessed items:", JSON.stringify(unprocessed, null, 2));
};
