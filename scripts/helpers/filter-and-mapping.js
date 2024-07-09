const { ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { mapObjectToDdb } = require("./map-ddb-object");
const uuid = require("./uuid");
const { createWriteStream } = require("fs");
const { format } = require("util");

const skipExistingRecord = (targetArray, newFieldName, item) =>
  targetArray.some((target) => target.id === item.id && !!target[newFieldName]);

const createTableItem = async (
  tableName,
  TableName,
  owner,
  item,
  client,
  log
) => {
  const id = uuid();
  const Item = mapObjectToDdb({
    ...item,
    __typename: tableName,
    id,
    owner,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  // log("Item", item, Item);
  await client.send(
    new PutItemCommand({
      TableName,
      Item,
    })
  );
  log(`Item created: (id: ${id})`);
  return { ...item, id };
};

const mapMeetingIdForActivity = (fromMeeting, meetings) => {
  if (!fromMeeting) return {};
  const meetingActivitiesId = meetings.find(
    ({ notionId }) => notionId === fromMeeting
  )?.id;
  if (!meetingActivitiesId) return {};
  return {
    meetingActivitiesId,
  };
};

const skipExistingManyToManyRecord = (
  existingRecords,
  sourceFieldName,
  linkFieldName,
  item
) =>
  existingRecords.some(
    (record) =>
      record[sourceFieldName] === item[sourceFieldName] &&
      record[linkFieldName] === item[linkFieldName]
  );

const _getIdFromNotionId = (array, compareItem) =>
  array.find((item) => item.notionId === compareItem)?.id;

const _mapRelationship = (idFieldName, id, linkFieldName, linkValue, rest) => ({
  [idFieldName]: id,
  [linkFieldName]: linkValue,
  ...rest,
});

const createManyToManySet =
  (sourceFieldName, sourceArray, targetFieldName, targetArray, linkFieldName) =>
  (item) => {
    const compareItem =
      typeof item[linkFieldName] === "object"
        ? item[linkFieldName].notionId
        : item[linkFieldName];
    const rest =
      typeof item[linkFieldName] === "object"
        ? (({ notionId, ...props }) => props)(item[linkFieldName])
        : {};

    return _mapRelationship(
      sourceFieldName,
      _getIdFromNotionId(sourceArray, item.notionId),
      targetFieldName,
      _getIdFromNotionId(targetArray, compareItem),
      rest
    );
  };

const createChangeSet =
  (sourceArray, newFieldName, targetArray, linkFieldName) => (item) => {
    const { [linkFieldName]: _, ...rest } = item;
    return _mapRelationship(
      "id",
      _getIdFromNotionId(sourceArray, item.notionId),
      newFieldName,
      _getIdFromNotionId(targetArray, item[linkFieldName]),
      rest
    );
  };

const mapNotionIdToId = (array) => (item) => ({
  ...item,
  id: _getIdFromNotionId(array, item.notionId),
});

const itemsWithLinks = (linkFieldName) => (item) =>
  !!item[linkFieldName] &&
  (!Array.isArray(item[linkFieldName]) || item[linkFieldName].length > 0);

const logFile = createWriteStream("import-data/logs.log", { flags: "a" });

const _writeLog = (...args) => {
  console.log(...args);
  logFile.write(`[${new Date().toISOString()}] - ${format(...args)}\n`);
};

const debugFp = (msg) => (data) => {
  _writeLog(msg, data);
  return data;
};

const stdLog =
  (stdInput) =>
  (...args) =>
    _writeLog(stdInput, ...args);

const getExistingRecords = (TableName, userId, client) =>
  client.send(
    new ScanCommand({
      TableName,
      FilterExpression: "#o = :owner",
      ExpressionAttributeNames: { "#o": "owner" },
      ExpressionAttributeValues: { ":owner": { S: userId } },
    })
  );

module.exports = {
  skipExistingRecord,
  skipExistingManyToManyRecord,
  createTableItem,
  createChangeSet,
  itemsWithLinks,
  getExistingRecords,
  createManyToManySet,
  debugFp,
  mapMeetingIdForActivity,
  mapNotionIdToId,
  stdLog,
};
