const {
  importHandler,
  createManyToManyTable,
  createRelation,
  searchValInArrayAndReturnObjKey,
  createAndRemapDayPlans,
} = require("./helpers/import-handler");
const env = "newDev";
const fs = require("fs");

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

  const updates = await createRelation(
    env,
    "Account",
    "_accounts.json",
    accounts,
    accounts,
    "controllerId",
    "accountSubsidiariesId",
    (mappedAccounts, controllerId) => mappedAccounts[controllerId]
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
    ({ participants, projectsDiscussed, newProjects, ...item }) => item
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

  const projectUpdates = await createRelation(
    env,
    "Projects",
    "_meetings.json",
    projects,
    meetings,
    "newProjects",
    "meetingNewProjectsId",
    searchValInArrayAndReturnObjKey
  );

  const accountProjects = await createManyToManyTable(
    env,
    "AccountProjects",
    "_projects.json",
    accounts,
    projects,
    "customerIds",
    "accountId",
    "projectsId",
    (item) => item
  );

  const batchProjects = await createManyToManyTable(
    env,
    "SixWeekBatchProjects",
    "_projects.json",
    batches,
    projects,
    "commitmentIds",
    "sixWeekBatchId",
    "projectsId",
    (item) => item
  );

  const people = await importHandler(
    env,
    "Person",
    "_people.json",
    ({ birtday, ...rest }) => ({ ...rest, birthday: birtday })
  );

  // const personAccounts = await createManyToManyTable(env, "PersonAccount", "_personAccount.json", );

  const meetingParticipants = await createManyToManyTable(
    env,
    "MeetingParticipant",
    "_meetings.json",
    people,
    meetings,
    "participants",
    "personId",
    "meetingId",
    (item) => item
  );

  const activities = await importHandler(
    env,
    "Activity",
    "_activities.json",
    ({ fromMeeting, forProjects, ...item }) => ({
      ...item,
      meetingActivitiesId: meetings.find(
        ({ notionId }) => notionId === fromMeeting
      )?.id,
    })
  );

  const projectActivities = await createManyToManyTable(
    env,
    "ProjectActivity",
    "_activities.json",
    projects,
    activities,
    "forProjects",
    "projectsId",
    "activityId",
    (item) => item
  );

  const dayplans = await importHandler(
    env,
    "DayPlan",
    "_dayPlans.json",
    (item) => item
  );

  return;

  // DONE:
  // Account
  // AccountProjects
  // Activity
  // DayPlan
  // DayProjectTask
  // Meeting
  // MeetingParticipant
  // NonProjectTask
  // Person
  // ProjectActivity
  // Projects
  // SixWeekCycle
  // SixWeekBatch
  // SixWeekBatchProjects

  // WIP:

  // TODO:

  // LATER/OUT-OF-SCOPE:
  // MeetingDiscussedProject
  // PersonAccount
};

const applyContext = async () => {
  console.log("Apply context to day plans...");
  await createAndRemapDayPlans(env);
};

// importData();

// applyContext();
