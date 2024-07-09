const { mapMeetingIdForActivity } = require("./helpers/filter-and-mapping");
const {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
} = require("./helpers/import-handler");
const env = "dev";

const importData = async () => {
  const accounts = await importHandler(
    env,
    "Account",
    "_accounts.json",
    ({ description, controllerId, ...item }) => ({
      ...item,
      introduction: description,
    })
  );

  await createRelation(
    env,
    "Account",
    "_accounts.json",
    accounts,
    accounts,
    "controllerId",
    "accountSubsidiariesId"
  );

  const sixweekcycle = await importHandler(
    env,
    "SixWeekCycle",
    "_sixweekcycle.json",
    (item) => item
  );

  const sixWeekCycleBatchesId = sixweekcycle[0].id;

  const batches = await importHandler(
    env,
    "SixWeekBatch",
    "_batches.json",
    (item) => ({ ...item, status: "inprogress", sixWeekCycleBatchesId })
  );

  const meetings = await importHandler(
    env,
    "Meeting",
    "_meetings.json",
    ({ participants, timeInvested, ...item }) => item
  );

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

  const people = await importHandler(
    env,
    "Person",
    "_people.json",
    ({ account, details, ...item }) => item
  );

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

  await createDetailRecord(
    env,
    "PersonDetail",
    "_people.json",
    people,
    "details",
    "personId",
    "label"
  );

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

  const activities = await importHandler(
    env,
    "Activity",
    "_activities.json",
    ({ fromMeeting, forProjects, ...item }) => ({
      ...item,
      ...mapMeetingIdForActivity(fromMeeting, meetings),
    })
  );

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
};

importData();
