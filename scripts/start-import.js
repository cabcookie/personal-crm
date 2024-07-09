const { mapMeetingIdForActivity } = require("./helpers/filter-and-mapping");
const {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
} = require("./helpers/import-handler");
const env = "dev";

const importData = async () => {
  // Account
  const accounts = await importHandler(
    env,
    "Account",
    "_accounts.json",
    ({ description, controllerId, ...item }) => ({
      ...item,
      introduction: description,
    })
  );

  // Account: subsidiaries and parent accounts
  await createRelation(
    env,
    "Account",
    "_accounts.json",
    accounts,
    accounts,
    "controllerId",
    "accountSubsidiariesId"
  );

  // SixWeekCycle
  const sixweekcycle = await importHandler(
    env,
    "SixWeekCycle",
    "_sixweekcycle.json",
    (item) => item
  );

  // SixWeekBatch
  const sixWeekCycleBatchesId = sixweekcycle[0].id;
  const batches = await importHandler(
    env,
    "SixWeekBatch",
    "_batches.json",
    (item) => ({ ...item, status: "inprogress", sixWeekCycleBatchesId })
  );

  // Meeting
  const meetings = await importHandler(
    env,
    "Meeting",
    "_meetings.json",
    ({ participants, timeInvested, ...item }) => item
  );

  // Projects
  const projects = await importHandler(
    env,
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
    env,
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
    env,
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
    env,
    "Person",
    "_people.json",
    ({ account, details, ...item }) => item
  );

  // PersonAccount: relationship between people and accounts
  await createManyToManyTable(
    env,
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
    env,
    "PersonDetail",
    "_people.json",
    people,
    "details",
    "personId",
    "label"
  );

  // MeetingParticipant: participants of meetings
  await createManyToManyTable(
    env,
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
    env,
    "Activity",
    "_activities.json",
    ({ fromMeeting, forProjects, ...item }) => ({
      ...item,
      ...mapMeetingIdForActivity(fromMeeting, meetings),
    })
  );

  // ProjectActivity: relationship between activities and projects
  await createManyToManyTable(
    env,
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
    env,
    "PersonLearning",
    "_learnings.json",
    ({ personId, ...item }) => ({
      ...item,
      personId: people.find((p) => p.notionId === personId)?.id,
    })
  );
};

importData();
