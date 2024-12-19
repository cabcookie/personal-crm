const {
  ScanCommand,
  UpdateItemCommand,
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");
const { stdLog } = require("./filter-and-mapping");
const { getTable, getEnvironment } = require("../import-data/environments");
const { getAwsProfile } = require("./get-aws-profile");
const { fromIni } = require("@aws-sdk/credential-providers");

const fillLearningPersonStatus = async () => {
  const TableName = getTable("PersonLearning");
  const log = stdLog(`[${TableName}] [UPDATE FIELD status]:`);
  log("Start processing…");
  const region = getEnvironment().region;
  const profile = getAwsProfile();
  const client = new DynamoDBClient({
    region,
    credentials: fromIni({ profile }),
  });
  const existingRecords = await client.send(
    new ScanCommand({
      TableName,
      FilterExpression: "attribute_not_exists(#f)",
      ExpressionAttributeNames: { "#f": "status" },
      Limit: 5000,
    })
  );
  log(
    "Relevant records:",
    existingRecords.Items.map(({ id }) => id.S)
  );
  await Promise.all(
    existingRecords.Items.map(async ({ id, createdAt }) => {
      log("Processing record with ID:", id.S, "and createdAt:", createdAt.S);
      const params = {
        TableName,
        Key: {
          id,
        },
        UpdateExpression: `SET #status = :newValue`,
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":newValue": { S: "new" },
        },
        ReturnValues: "UPDATED_NEW",
      };
      log("Update params:", params);
      const response = await client.send(new UpdateItemCommand(params));
      log(
        "Response:",
        "StatusCode",
        response.$metadata.httpStatusCode,
        "Attributes",
        response.Attributes.status
      );
    })
  );
};

module.exports = {
  fillLearningPersonStatus,
};
