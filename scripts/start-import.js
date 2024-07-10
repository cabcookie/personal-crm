const { mapMeetingIdForActivity } = require("./helpers/filter-and-mapping");
const {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
} = require("./helpers/import-handler");

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
};

importData();
