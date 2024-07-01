const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { loadConfig } = require("./load-config");
const { getAwsProfile } = require("./get-aws-profile");
const uuid = require("../../components/import-data/imports-aws-sdk/uuid");

const { environmentId, region } = loadConfig();
const profile = getAwsProfile();
const client = new DynamoDBClient({
  region,
  credentials: fromIni({ profile }),
});

/**
 * Creates a new item in the DynamoDB table.
 *
 * @example
 * const item = await createTableItem('table-name', { name: { S: 'John' } }, 'user-id');
 * @param {string} tableName Name of the DynamoDB table
 * @param {any} item Object with the data to be stored in DDB
 * @param {string} userId User for which the item is being created.
 */
const createTableItem = async (tableName, item, userId) => {
  const id = { S: uuid() };
  const Item = {
    __typename: { S: tableName },
    id,
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
    owner: { S: userId },
    ...item,
  };
  await client.send(
    new PutItemCommand({
      TableName: `${tableName}-${environmentId}-NONE`,
      Item,
    })
  );
  return {
    id,
    ...item,
  };
};

module.exports = {
  createTableItem,
};
