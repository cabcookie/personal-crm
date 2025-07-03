const {
  mapMeetingIdForActivity,
  logTables,
} = require("./helpers/filter-and-mapping");
const {
  importHandler,
  createManyToManyTable,
  createRelation,
  createDetailRecord,
} = require("./helpers/import-handler");
const {
  fillLearningPersonStatus,
} = require("./helpers/fill-learning-person-status");
const {
  makeCurrent,
  addPropWithCurrentDate,
} = require("./helpers/make-current");

const importData = async () => {
  // Books of the Bible
  // const booksOfBible = await importHandler(
  //   "BookOfBible",
  //   "_booksOfBible.json",
  //   (item) => item
  // );

  // Notes on Bible chapters
  // await importHandler(
  //   "NotesBibleChapter",
  //   "_notesBibleBooks.json",
  //   ({ bookBibleId, notes, ...item }) => ({
  //     ...item,
  //     bookId: booksOfBible.find((b) => b.notionId === bookBibleId)?.id,
  //     note: notes,
  //     formatVersion: 1,
  //   })
  // );

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
  // const sixweekcycle = await importHandler(
  //   "SixWeekCycle",
  //   "_sixweekcycle.json",
  //   (item) => item
  // );

  // SixWeekBatch
  // const sixWeekCycleBatchesId = sixweekcycle[0].id;
  // const batches = await importHandler(
  //   "SixWeekBatch",
  //   "_batches.json",
  //   (item) => ({ ...item, status: "inprogress", sixWeekCycleBatchesId })
  // );

  // Meeting
  const meetings = await importHandler(
    "Meeting",
    "_meetings.json",
    ({ participants, timeInvested, meetingOn, ...item }) => ({
      ...item,
      meetingOn: makeCurrent(meetingOn),
    })
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
      dueOn,
      doneOn,
      onHoldTill,
      ...rest
    }) => ({
      createdOnDay: makeCurrent(createdAt, true),
      ...addPropWithCurrentDate("dueOn", dueOn, true),
      ...addPropWithCurrentDate("doneOn", doneOn, true),
      ...addPropWithCurrentDate("onHoldTill", onHoldTill, true),
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
  // await createManyToManyTable(
  //   "SixWeekBatchProjects",
  //   "_projects.json",
  //   projects,
  //   batches,
  //   "commitmentIds",
  //   "projectsId",
  //   "sixWeekBatchId"
  // );

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
    ({ fromMeeting, forProjects, finishedOn, ...item }) => ({
      ...item,
      finishedOn: makeCurrent(finishedOn),
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
    ({ personId, learnedOn, ...item }) => ({
      ...item,
      learnedOn: makeCurrent(learnedOn, true),
      personId: people.find((p) => p.notionId === personId)?.id,
    })
  );

  // CrmProjects: Projects from SFDC
  const crmProjects = await importHandler(
    "CrmProject",
    "_crmProjects.json",
    ({ projectNotionIds, closeDate, ...item }) => ({
      ...item,
      closeDate: makeCurrent(closeDate, true),
    })
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
// fillLearningPersonStatus();
