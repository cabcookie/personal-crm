import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Context: a.enum(["family", "hobby", "work"]),
  CurrentContext: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      context: a.ref("Context").required(),
    })
    .authorization((allow) => [allow.owner()]),
  Inbox: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      note: a.string(),
      formatVersion: a.integer().default(1),
      noteJson: a.json(),
      status: a.id().required(),
      movedToActivityId: a.string(),
    })
    .secondaryIndexes((inbox) => [inbox("status")])
    .authorization((allow) => [allow.owner()]),
  DayPlan: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      day: a.date().required(),
      dayGoal: a.string().required(),
      context: a.ref("Context").required(),
      done: a.boolean().required(),
      tasks: a.hasMany("NonProjectTask", "dayPlanTasksId"),
      projectTasks: a.hasMany("DayProjectTask", "dayPlanProjectTasksId"),
      todos: a.hasMany("DayPlanTodo", "dayPlanTodosId"),
    })
    .authorization((allow) => [allow.owner()]),
  DayPlanTodo: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      todo: a.string().required(),
      done: a.boolean().required(),
      doneOn: a.date(),
      dayPlanTodosId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanTodosId"),
      projectsTodosId: a.id(),
      project: a.belongsTo("Projects", "projectsTodosId"),
    })
    .authorization((allow) => [allow.owner()]),
  DayProjectTask: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      task: a.string().required(),
      done: a.boolean(),
      dayPlanProjectTasksId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanProjectTasksId"),
      projectsDayTasksId: a.id(),
      projects: a.belongsTo("Projects", "projectsDayTasksId"),
    })
    .authorization((allow) => [allow.owner()]),
  NonProjectTask: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      dayPlanTasksId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanTasksId"),
      task: a.string().required(),
      context: a.ref("Context"),
      done: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),
  ProjectActivity: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      activityId: a.id().required(),
      activity: a.belongsTo("Activity", "activityId"),
      projectsId: a.id().required(),
      projects: a.belongsTo("Projects", "projectsId"),
    })
    .secondaryIndexes((index) => [index("projectsId")])
    .authorization((allow) => [allow.owner()]),
  Activity: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      notes: a.string(),
      formatVersion: a.integer().default(1),
      notesJson: a.json(),
      forProjects: a.hasMany("ProjectActivity", "activityId"),
      meetingActivitiesId: a.id(),
      forMeeting: a.belongsTo("Meeting", "meetingActivitiesId"),
      finishedOn: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
  MeetingParticipant: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      meetingId: a.id().required(),
      meeting: a.belongsTo("Meeting", "meetingId"),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
    })
    .authorization((allow) => [allow.owner()]),
  Meeting: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      context: a.ref("Context"),
      topic: a.string().required(),
      meetingOn: a.datetime(),
      participants: a.hasMany("MeetingParticipant", "meetingId"),
      activities: a.hasMany("Activity", "meetingActivitiesId"),
    })
    .authorization((allow) => [allow.owner()]),
  Person: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      name: a.string().required(),
      howToSay: a.string(),
      birthday: a.date(),
      dateOfDeath: a.date(),
      meetings: a.hasMany("MeetingParticipant", "personId"),
    })
    .authorization((allow) => [allow.owner()]),
  TerritoryResponsibility: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      territoryId: a.id().required(),
      territory: a.belongsTo("Territory", "territoryId"),
      startDate: a.date().required(),
      quota: a.integer().default(0),
    })
    .authorization((allow) => [allow.owner()]),
  Territory: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      name: a.string(),
      crmId: a.string(),
      responsibilities: a.hasMany("TerritoryResponsibility", "territoryId"),
      accounts: a.hasMany("AccountTerritory", "territoryId"),
    })
    .authorization((allow) => [allow.owner()]),
  AccountTerritory: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
      territoryId: a.id().required(),
      territory: a.belongsTo("Territory", "territoryId"),
    })
    .authorization((allow) => [allow.owner()]),
  AccountProjects: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
      projectsId: a.id().required(),
      projects: a.belongsTo("Projects", "projectsId"),
    })
    .secondaryIndexes((index) => [index("projectsId"), index("accountId")])
    .authorization((allow) => [allow.owner()]),
  PayerAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      awsAccountNumber: a.id().required(),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
    })
    .identifier(["awsAccountNumber"])
    .authorization((allow) => [allow.owner()]),
  Account: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      name: a.string().required(),
      order: a.integer(),
      introduction: a.string(),
      introductionJson: a.json(),
      formatVersion: a.integer().default(1),
      crmId: a.string(),
      subsidiaries: a.hasMany("Account", "accountSubsidiariesId"),
      territories: a.hasMany("AccountTerritory", "accountId"),
      projects: a.hasMany("AccountProjects", "accountId"),
      accountSubsidiariesId: a.id(),
      controller: a.belongsTo("Account", "accountSubsidiariesId"),
      payerAccounts: a.hasMany("PayerAccount", "accountId"),
    })
    .authorization((allow) => [allow.owner()]),
  SixWeekCycle: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      name: a.string().required(),
      startDate: a.date(),
      batches: a.hasMany("SixWeekBatch", "sixWeekCycleBatchesId"),
    })
    .authorization((allow) => [allow.owner()]),
  SixWeekBatchProjects: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      projectsId: a.id().required(),
      projects: a.belongsTo("Projects", "projectsId"),
      sixWeekBatchId: a.id().required(),
      sixWeekBatch: a.belongsTo("SixWeekBatch", "sixWeekBatchId"),
    })
    .authorization((allow) => [allow.owner()]),
  SixWeekBatch: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      idea: a.string().required(),
      status: a.enum([
        "idea",
        "appetite",
        "inprogress",
        "declined",
        "aborted",
        "finished",
      ]),
      sixWeekCycleBatchesId: a.id().required(),
      sixWeekCycle: a.belongsTo("SixWeekCycle", "sixWeekCycleBatchesId"),
      context: a.ref("Context"),
      appetite: a.enum(["big", "small"]),
      hours: a.integer(),
      problem: a.string(),
      solution: a.string(),
      risks: a.string(),
      noGos: a.string(),
      projects: a.hasMany("SixWeekBatchProjects", "sixWeekBatchId"),
      createdOn: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
  CrmProjectProjects: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      projectId: a.id().required(),
      crmProjectId: a.id().required(),
      project: a.belongsTo("Projects", "projectId"),
      crmProject: a.belongsTo("CrmProject", "crmProjectId"),
    })
    .authorization((allow) => [allow.owner()]),
  CrmProject: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      name: a.string().required(),
      crmId: a.string(),
      annualRecurringRevenue: a.integer(),
      totalContractVolume: a.integer(),
      isMarketplace: a.boolean(),
      closeDate: a.date().required(),
      projects: a.hasMany("CrmProjectProjects", "crmProjectId"),
      stage: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),
  Projects: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      project: a.string().required(),
      done: a.boolean(),
      doneOn: a.date(),
      dueOn: a.date(),
      onHoldTill: a.date(),
      myNextActions: a.string(),
      othersNextActions: a.string(),
      formatVersion: a.integer().default(1),
      myNextActionsJson: a.json(),
      othersNextActionsJson: a.json(),
      context: a.ref("Context").required(),
      accounts: a.hasMany("AccountProjects", "projectsId"),
      batches: a.hasMany("SixWeekBatchProjects", "projectsId"),
      activities: a.hasMany("ProjectActivity", "projectsId"),
      dayTasks: a.hasMany("DayProjectTask", "projectsDayTasksId"),
      todos: a.hasMany("DayPlanTodo", "projectsTodosId"),
      crmProjects: a.hasMany("CrmProjectProjects", "projectId"),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
