const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");
const { getTable } = require("../import-data/tables");
const { getAwsProfile } = require("./get-aws-profile");
const { mapDdbToObject } = require("./map-ddb-object");
const { flow, map, filter, flatMap, get } = require("lodash/fp");
const region = "eu-west-1";
const profile = getAwsProfile();
const client = new DynamoDBClient({
  region,
  credentials: fromIni({ profile }),
});
const fs = require("fs");
const {
  itemsWithLinks,
  createChangeSet,
  skipExistingRecord,
  getExistingRecords,
  debugFp,
  createManyToManySet,
  skipExistingManyToManyRecord,
  createTableItem,
  stdLog,
  mapNotionIdToId,
} = require("./filter-and-mapping");
const { getUser } = require("./get-user");

/**
 * Creates records in a many to many relationship table.
 *
 * @param {"dev" | "prod"} env The environment in which the operation should be proceeded ('dev' or 'prod')
 * @param {String} manyToManyTableName The name of the DynamoDB table where you would like to create the many to many relationship
 * @param {String} sourceJsonFileName The name of the JSON file that holds the original data with the link information
 * @param {Array} sourceArray The source array containing the original data.
 * @param {Array} targetArray The target array where we want to link to.
 * @param {String} arrayLinkFieldName The name of the field in the JSON file that links to the source array's notionId.
 * @param {String} sourceFieldName The name of the new field to be created that links to the target array's id.
 * @param {String} targetFieldName The name of the new field to be created that links to the source array's id.
 * @param {Function} mapArrayToDdb A function to map the fields from the import data to the schema of the DynamoDB table
 * @returns the imported data
 */
const createManyToManyTable = async (
  env,
  manyToManyTableName,
  sourceJsonFileName,
  sourceArray,
  targetArray,
  arrayLinkFieldName,
  sourceFieldName,
  targetFieldName
) => {
  const TableName = getTable(manyToManyTableName, env);
  const log = stdLog(
    `[${TableName}] [CREATE N:N RELATION] [${sourceJsonFileName}]:`
  );
  log("start import");
  const owner = await getUser(env, region);
  const ddbData = await getExistingRecords(TableName, owner, client);
  const count = ddbData.Count;
  log(`Items in table: ${count}`);
  const existingRecords = ddbData.Items.map(mapDdbToObject);
  const createManyToManySets = flow(
    (file) => `import-data/${file}`,
    (file) => fs.readFileSync(file, "utf-8"),
    JSON.parse,
    filter((item) => item[arrayLinkFieldName]),
    flatMap((item) =>
      item[arrayLinkFieldName].map((obj) => ({
        notionId: item.notionId,
        [arrayLinkFieldName]: obj,
      }))
    ),
    map(
      createManyToManySet(
        sourceFieldName,
        sourceArray,
        targetFieldName,
        targetArray,
        arrayLinkFieldName
      )
    ),
    filter(itemsWithLinks(targetFieldName))
  )(sourceJsonFileName);

  const results = await Promise.all(
    createManyToManySets.map((item) => {
      if (
        skipExistingManyToManyRecord(
          existingRecords,
          sourceFieldName,
          targetFieldName,
          item
        )
      )
        return item;
      return createTableItem(
        manyToManyTableName,
        TableName,
        owner,
        item,
        client,
        log
      );
    })
  );

  return results;
};

/**
 * Updates records in a DynamoDB table to link to another DynamoDB table.
 *
 * @param {"dev" | "prod"} env The environment in which the operation should be proceeded ('dev' or 'prod')
 * @param {String} tableName The name of the DynamoDB table where you would like to update the records to link to another table
 * @param {String} sourceJsonFileName The name of the JSON file that holds the original data with the link information (notionIDs but no IDs)
 * @param {Array} sourceArray The source array containing the original data (with a notionId and an ID).
 * @param {Array} targetArray The target array where we want to link to (with a notionId and an ID).
 * @param {String} linkFieldName The name of the field in the source array that links to the target array's notionId.
 * @param {String} newFieldName The name of the new field to be created that links to the target array's id.
 * @returns the updated data
 */
const createRelation = async (
  env,
  tableName,
  sourceJsonFileName,
  sourceArray,
  targetArray,
  linkFieldName,
  newFieldName
) => {
  const TableName = getTable(tableName, env);
  const log = stdLog(`[${TableName}] [CREATE RELATION]:`);
  log(`create relationship between "${linkFieldName}" and "${newFieldName}"`);
  const changeSets = flow(
    (file) => `import-data/${file}`,
    (file) => fs.readFileSync(file, "utf-8"),
    JSON.parse,
    filter(itemsWithLinks(linkFieldName)),
    map(createChangeSet(sourceArray, newFieldName, targetArray, linkFieldName))
  )(sourceJsonFileName);

  const results = await Promise.all(
    changeSets.map(async (Item) => {
      if (skipExistingRecord(targetArray, newFieldName, Item)) return Item;
      const params = {
        TableName,
        Key: {
          id: { S: Item.id },
        },
        UpdateExpression: `SET ${newFieldName} = :newValue`,
        ExpressionAttributeValues: {
          ":newValue": { S: Item[newFieldName] },
        },
        ReturnValues: "UPDATED_NEW",
      };
      await client.send(new UpdateItemCommand(params));
      log(
        `relationship created (id: ${Item.id}, ${newFieldName}: ${Item[newFieldName]}`
      );
      return Item;
    })
  );
  return results;
};

/**
 * For an existing record create a detail record in another table that links to the original record.
 *
 * @param {"dev" | "prod"} env The environment in which the operation should be proceeded ('dev' or 'prod')
 * @param {String} tableName The name of the DynamoDB table where you would like to create the detail records
 * @param {String} jsonFileName The name of the JSON file that holds the original data with the link information
 * @param {Array} sourceArray The source array containing the original data (with a notionId and an ID).
 * @param {String} sourceFieldName The name of the field in the sourceArray which holds the detail information
 * @param {String} targetFieldName The name of the field in the DynamoDB table which links to the original record
 * @param {String} compareFieldName The name of the field which is used to verify if a record already exists, to prohibit redundancy
 * @returns the new record created
 */
const createDetailRecord = async (
  env,
  tableName,
  jsonFileName,
  sourceArray,
  sourceFieldName,
  targetFieldName,
  compareFieldName
) => {
  const TableName = getTable(tableName, env);
  const owner = await getUser(env, region);
  const log = stdLog(`[${TableName}] [IMPORT DATA] [${jsonFileName}]:`);
  log("start import");
  const ddbData = await getExistingRecords(TableName, owner, client);
  const count = ddbData.Count;
  log(`Items in table: ${count}`);
  const existingRecords = ddbData.Items.map(mapDdbToObject);

  const createDataSets = flow(
    (f) => `import-data/${f}`,
    (f) => fs.readFileSync(f, "utf-8"),
    JSON.parse,
    filter(itemsWithLinks(sourceFieldName)),
    map(mapNotionIdToId(sourceArray)),
    flatMap((item) =>
      flow(
        get(sourceFieldName),
        map((detail) => ({
          [targetFieldName]: item.id,
          ...detail,
        }))
      )(item)
    )
  )(jsonFileName);

  const results = await Promise.all(
    createDataSets.map((item) => {
      if (
        existingRecords.some(
          (r) =>
            r.id === item.id &&
            r[sourceFieldName] &&
            r[
              sourceFieldName.some(
                (s) => s[compareFieldName] === item[compareFieldName]
              )
            ]
        )
      )
        return item;
      return createTableItem(tableName, TableName, owner, item, client, log);
    })
  );

  return results;
};

/**
 * Imports data from a JSON file into the desired DynamoDB table in dev or prod environment.
 *
 * @param {"dev" | "prod"} env The environment in which the operation should be proceeded ('dev' or 'prod')
 * @param {String} tableName The name of the DynamoDB table to which the data should be imported
 * @param {String} jsonFileName The name of the JSON file that holds the data to be imported
 * @param {Function} mapArrayToDdb A function to map the fields from the import data to the schema of the DynamoDB table
 * @returns the imported data
 */
const importHandler = async (env, tableName, jsonFileName, mapArrayToDdb) => {
  const TableName = getTable(tableName, env);
  const log = stdLog(`[${TableName}] [IMPORT DATA] [${jsonFileName}]:`);
  log("start import");
  const jsonData = JSON.parse(
    fs.readFileSync(`import-data/${jsonFileName}`, "utf8")
  );
  const owner = await getUser(env, region);
  const ddbData = await getExistingRecords(TableName, owner, client);
  const count = ddbData.Count;
  log(`Items in table: ${count}`);
  const existingRecords = ddbData.Items.map(mapDdbToObject);

  const results = await Promise.all(
    jsonData.map((item) => {
      const existingRecord = existingRecords.find(
        ({ notionId }) => notionId === item.notionId
      );
      if (existingRecord) return existingRecord;

      return createTableItem(
        tableName,
        TableName,
        owner,
        mapArrayToDdb(item),
        client,
        log
      );
    })
  );

  return results;
};

module.exports = {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
};
