const {
  ScanCommand,
  UpdateItemCommand,
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");
const {
  mapMeetingIdForActivity,
  logTables,
  stdLog,
} = require("./helpers/filter-and-mapping");
const {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
} = require("./helpers/import-handler");
const { getTable, getEnvironment } = require("./import-data/environments");
const { getAwsProfile } = require("./helpers/get-aws-profile");
const { fromIni } = require("@aws-sdk/credential-providers");

const importData = async () => {
  // Account
  const accounts = await importHandler(
    "Account",
    "_accounts.json",
    ({ description, controllerId, ...item }) => ({
      ...item,
      introduction: description,
    })
  );

  // Account: subsidiaries and parent accounts
  await createRelation(
    "Account",
    "_accounts.json",
    accounts,
    accounts,
    "controllerId",
    "accountSubsidiariesId"
  );

  // SixWeekCycle
  const sixweekcycle = await importHandler(
    "SixWeekCycle",
    "_sixweekcycle.json",
    (item) => item
  );

  // SixWeekBatch
  const sixWeekCycleBatchesId = sixweekcycle[0].id;
  const batches = await importHandler(
    "SixWeekBatch",
    "_batches.json",
    (item) => ({ ...item, status: "inprogress", sixWeekCycleBatchesId })
  );

  // Meeting
  const meetings = await importHandler(
    "Meeting",
    "_meetings.json",
    ({ participants, timeInvested, ...item }) => item
  );

  // Projects
  const projects = await importHandler(
    "Projects",
    "_projects.json",
    ({
      nextActionsOfOthers,
      createdAt,
      customerIds,
      commitmentIds,
      ...rest
    }) => ({
      createdOnDay: createdAt,
      othersNextActions: nextActionsOfOthers,
      ...rest,
    })
  );

  // AccountProjects: relationship between accounts and projects
  await createManyToManyTable(
    "AccountProjects",
    "_projects.json",
    projects,
    accounts,
    "customerIds",
    "projectsId",
    "accountId"
  );

  // SixWeekBatchProjects: relationship between 6-week batches and projects
  await createManyToManyTable(
    "SixWeekBatchProjects",
    "_projects.json",
    projects,
    batches,
    "commitmentIds",
    "projectsId",
    "sixWeekBatchId"
  );

  // People
  const people = await importHandler(
    "Person",
    "_people.json",
    ({ account, details, ...item }) => item
  );

  // PersonAccount: relationship between people and accounts
  await createManyToManyTable(
    "PersonAccount",
    "_people.json",
    people,
    accounts,
    "account",
    "personId",
    "accountId"
  );

  // PersonDetail: details like email, phone numbers etc.
  await createDetailRecord(
    "PersonDetail",
    "_people.json",
    people,
    "details",
    "personId",
    "label"
  );

  // MeetingParticipant: participants of meetings
  await createManyToManyTable(
    "MeetingParticipant",
    "_meetings.json",
    meetings,
    people,
    "participants",
    "meetingId",
    "personId"
  );

  // Activity: notes on meetings and projects
  const activities = await importHandler(
    "Activity",
    "_activities.json",
    ({ fromMeeting, forProjects, ...item }) => ({
      ...item,
      ...mapMeetingIdForActivity(fromMeeting, meetings),
    })
  );

  // ProjectActivity: relationship between activities and projects
  await createManyToManyTable(
    "ProjectActivity",
    "_activities.json",
    activities,
    projects,
    "forProjects",
    "activityId",
    "projectsId"
  );

  // PersonLearning: things I learned about a person
  await importHandler(
    "PersonLearning",
    "_learnings.json",
    ({ personId, ...item }) => ({
      ...item,
      personId: people.find((p) => p.notionId === personId)?.id,
    })
  );

  // CrmProjects: Projects from SFDC
  const crmProjects = await importHandler(
    "CrmProject",
    "_crmProjects.json",
    ({ projectNotionIds, ...item }) => item
  );

  // CrmProjectProjects: link CRM Projects with Projects
  await createManyToManyTable(
    "CrmProjectProjects",
    "_crmProjects.json",
    crmProjects,
    projects,
    "projectNotionIds",
    "crmProjectId",
    "projectId"
  );
};

const fillFinishedOn = async () => {
  const TableName = getTable("Activity");
  const log = stdLog(`[${TableName}] [UPDATE FIELD finishedOn]:`);
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
      ExpressionAttributeNames: { "#f": "finishedOn" },
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
        UpdateExpression: `SET finishedOn = :newValue`,
        ExpressionAttributeValues: {
          ":newValue": createdAt,
        },
        ReturnValues: "UPDATED_NEW",
      };
      const response = await client.send(new UpdateItemCommand(params));
      log(
        "Response:",
        "StatusCode",
        response.$metadata.httpStatusCode,
        "Attributes",
        response.Attributes.finishedOn
      );
    })
  );
};

/**
 * Importing data requires the files mentioned in the importData function to exist.
 * Like:
 * - _accounts.json
 * - _projects.json
 * - ...
 *
 * To start the import run the following command in the root of your project:
 * npm run import-data-dev -- -e info@example.com
 *
 * The email address is being used to create a user and a profile.
 * You will receive a temporary password in your inbox.
 *
 * Make sure your env.json points towards the correct environment.
 */

// importData();
// logTables();
// fillFinishedOn();
