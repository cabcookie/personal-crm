const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { loadConfig } = require("./load-config");
const { getAwsProfile } = require("./get-aws-profile");

/**
 * Checks that the table has all the expected fields and returns existing items.
 *
 * @param {string} tableName Name of the DynamoDB table to scan.
 * @param {string} userId User ID of the owner.
 * @returns {Promise<Object[]>} List of existing items in the table.
 */
const getTableItems = async (tableName, userId) => {
  const { environmentId, region } = loadConfig();
  const profile = getAwsProfile();
  const client = new DynamoDBClient({
    region,
    credentials: fromIni({ profile }),
  });
  const TableName = `${tableName}-${environmentId}-NONE`;
  const items = await client.send(
    new ScanCommand({
      TableName,
      FilterExpression: "#o = :owner",
      ExpressionAttributeNames: { "#o": "owner" },
      ExpressionAttributeValues: { ":owner": { S: userId } },
    })
  );
  console.log("Existing items", {
    tableName,
    TableName,
    items: items.Items.map((i) => JSON.stringify(i)),
  });
  return items.Items;
};

module.exports = { getTableItems };
