const {
  UpdateItemCommand,
  DynamoDBClient,
  QueryCommand,
  DeleteItemCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { getTable, getEnvironment } = require("../import-data/environments");
const { getAwsProfile } = require("./get-aws-profile");
const { stdLog } = require("./filter-and-mapping");
const { fromIni } = require("@aws-sdk/credential-providers");
const { flow, map, uniq, slice, join, get, split, last } = require("lodash/fp");
const { getUser } = require("./get-user");
const uuid = require("./uuid");
const { mapObjectToDdb, mapDdbToObject } = require("./map-ddb-object");

const region = getEnvironment().region;
const profile = getAwsProfile();
const client = new DynamoDBClient({
  region,
  credentials: fromIni({ profile }),
});

const getProjectIds = async (activityId) => {
  const TableName = getTable("ProjectActivity");
  const projects = await client.send(
    new QueryCommand({
      TableName,
      IndexName: "gsi-Activity.forProjects",
      KeyConditionExpression: "activityId = :activityId",
      ExpressionAttributeValues: {
        ":activityId": { S: activityId },
      },
      Limit: 5000,
    })
  );
  return {
    activityId,
    projectIds: flow(map("projectsId.S"), uniq)(projects.Items),
  };
};

const getTodoStatus = async (todoId) => {
  const TableName = getTable("Todo");
  const todo = await client.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": { S: todoId },
      },
      Limit: 5000,
    })
  );
  return flow(get(0), get("status.S"))(todo.Items);
};

const mapProjectTodo = async ({ todoId, projectIds }) => {
  const log = stdLog(`[mapProjectTodo, todo: ${todoId}]:`);
  const TableName = getTable("ProjectTodo");
  const todoStatus = await getTodoStatus(todoId);
  if (!todoStatus) {
    log("No todo status found, skipping…");
    return;
  }
  const projects = await client.send(
    new QueryCommand({
      TableName,
      IndexName: "gsi-Todo.projects",
      KeyConditionExpression: "todoId = :todoId",
      ExpressionAttributeValues: {
        ":todoId": { S: todoId },
      },
      Limit: 5000,
    })
  );
  await Promise.all(
    map(deleteProjectTodo(todoId, projectIds, todoStatus))(projects.Items)
  );
  await Promise.all(
    map(createProjectTodo(todoId, projects.Items, todoStatus))(projectIds)
  );
};

const getProjectId = flow(
  get("projectIdTodoStatus.S"),
  split("-"),
  slice(0, -1),
  join("-")
);

const getDbTodoStatus = flow(get("projectIdTodoStatus.S"), split("-"), last);

const createProjectTodo =
  (todoId, projects, todoStatus) => async (projectId) => {
    const projectIds = map(getProjectId)(projects);
    const log = stdLog(
      `[createProjectTodo, todo: ${todoId}, project: ${projectId}]:`
    );
    if (projectIds.includes(projectId)) return;
    log("Project doesn't exist, creating…");
    const TableName = getTable("ProjectTodo");
    const owner = await getUser();
    const id = uuid();
    const Item = mapObjectToDdb({
      id,
      createdAt: new Date().toISOString(),
      owner,
      projectIdTodoStatus: `${projectId}-${todoStatus}`,
      todoId,
      updatedAt: new Date().toISOString(),
      __typename: "ProjectTodo",
    });
    const result = await client.send(
      new PutItemCommand({
        TableName,
        Item,
      })
    );
    log(
      `Item created: (id: ${id}), status code: ${
        result.$metadata.httpStatusCode
      }, item: ${flow(mapDdbToObject, JSON.stringify)(Item)}`
    );
  };

const updateProjectStatus = async (todoId, id, projectId, status) => {
  const log = stdLog(
    `[updateProjectStatus, todo: ${todoId}, project: ${projectId}]:`
  );
  const TableName = getTable("ProjectTodo");
  const params = {
    TableName,
    Key: {
      id: { S: id },
    },
    UpdateExpression: `SET projectIdTodoStatus = :newValue`,
    ExpressionAttributeValues: {
      ":newValue": { S: `${projectId}-${status}` },
    },
    ReturnValues: "UPDATED_NEW",
  };
  const response = await client.send(new UpdateItemCommand(params));
  log("Status updated:", response.Attributes.projectIdTodoStatus.S);
};

const deleteProjectTodo =
  (todoId, projectIds, todoStatus) => async (project) => {
    const dbTodoStatus = getDbTodoStatus(project);
    const projectId = getProjectId(project);
    const log = stdLog(
      `[deleteProjectTodo, todo: ${todoId}, project: ${projectId}]:`
    );
    if (projectIds.includes(projectId) && todoStatus === dbTodoStatus) return;
    if (projectIds.includes(projectId) && todoStatus !== dbTodoStatus) {
      log("Project exists but with wrong status…");
      await updateProjectStatus(todoId, project.id.S, projectId, todoStatus);
      return;
    }
    log("Project exists but shouldn't, deleting…");
    const TableName = getTable("ProjectTodo");
    const params = {
      TableName,
      Key: {
        id: { S: project.id.S },
      },
    };
    const response = await client.send(new DeleteItemCommand(params));
    log("Deleted", "StatusCode", response.$metadata.httpStatusCode);
  };

module.exports = {
  getProjectIds,
  mapProjectTodo,
};
