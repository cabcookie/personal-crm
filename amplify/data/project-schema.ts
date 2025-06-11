import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "AccountProjects",
  "SixWeekCycle",
  "SixWeekBatchProjects",
  "SixWeekBatch",
  "CrmProjectImport",
  "CrmProjectProjects",
  "CrmProject",
  "Projects",
];

const projectSchema = {
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
  CrmProjectImportStatus: a.enum(["WIP", "DONE"]),
  CrmProjectImport: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      s3Key: a.string().required(),
      status: a.ref("CrmProjectImportStatus").required(),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["createdAt"]).queryField("listByImportStatus"),
    ])
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
      confirmHygieneIssuesSolvedTill: a.datetime(),
      stage: a.string().required(),
      opportunityOwner: a.string(),
      nextStep: a.string(),
      partnerName: a.string(),
      type: a.string(),
      stageChangedDate: a.date(),
      accountName: a.string(),
      territoryName: a.string(),
      createdDate: a.date(),
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
      order: a.float(),
      tasksSummary: a.string(),
      tasksSummaryUpdatedAt: a.datetime(),
      accounts: a.hasMany("AccountProjects", "projectsId"),
      batches: a.hasMany("SixWeekBatchProjects", "projectsId"),
      activities: a.hasMany("ProjectActivity", "projectsId"),
      crmProjects: a.hasMany("CrmProjectProjects", "projectId"),
      weekPlans: a.hasMany("WeeklyPlanProject", "projectId"),
      dayPlans: a.hasMany("DailyPlanProject", "projectId"),
      partnerId: a.id(),
      partner: a.belongsTo("Account", "partnerId"),
    })
    .secondaryIndexes((index) => [
      index("partnerId").queryField("listByPartnerId"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default projectSchema;
