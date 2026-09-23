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
  // ------ Enums
  CrmProjectImportStatus: a.enum(["WIP", "DONE"]),
  ProjectPinned: a.enum(["PINNED", "NOTPINNED"]),

  // ------ Models
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
      // AI-generated prose summary of the whole project, regenerated ~6 min
      // after the last activity-markdown snapshot changes (trailing debounce).
      // Shown in the project detail view.
      projectSummary: a.string(),
      projectSummaryUpdatedAt: a.datetime(),
      // Semantic-search vector over "<project name> — <first summary section>"
      // produced by the debounced project-embedding pipeline (Titan Text
      // Embeddings v2, 1024 dims). Declared here so Amplify knows the
      // attribute, but the actual value is written directly to DynamoDB as a
      // native List<Number> (`L` of `N`) by the embedding Lambda — NOT through
      // AppSync, which would JSON-stringify it and make it unsearchable. A
      // DynamoDB vector index (`ProjectSummaryEmbeddingIndex`) is created on
      // this attribute via a CDK custom resource (see
      // custom/backend/project-summary.ts). Never write this from the client.
      summaryEmbedding: a.json(),
      summaryEmbeddingUpdatedAt: a.datetime(),
      // Source text the embedding was last generated from. Lets the pipeline
      // skip re-embedding (a Bedrock call) when the semantic inputs (name +
      // first summary section) did not actually change.
      summaryEmbeddingSource: a.string(),
      // Backfill marker. Set to "1" by scripts/mark-projects-embedding-pending.js
      // on existing projects that lack an embedding. The backfill worker clears
      // it once the embedding is generated. Left unset in normal operation, so
      // the GSI below is SPARSE — it holds only projects still awaiting a
      // backfilled embedding.
      summaryEmbeddingPending: a.string(),
      pinned: a.ref("ProjectPinned").required(),
      // Ids for relations
      partnerId: a.id(),
      // relations
      partner: a.belongsTo("Account", "partnerId"),
      accounts: a.hasMany("AccountProjects", "projectsId"),
      batches: a.hasMany("SixWeekBatchProjects", "projectsId"),
      activities: a.hasMany("ProjectActivity", "projectsId"),
      crmProjects: a.hasMany("CrmProjectProjects", "projectId"),
      weekPlans: a.hasMany("WeeklyPlanProject", "projectId"),
      dayPlans: a.hasMany("DailyPlanProject", "projectId"),
      weeklyReviews: a.hasMany("WeeklyReviewEntry", "projectId"),
    })
    .secondaryIndexes((index) => [
      index("partnerId").queryField("listByPartnerId"),
      index("pinned").queryField("listByPinnedState"),
      // Sparse work-queue index for the project-embedding backfill.
      index("summaryEmbeddingPending").queryField(
        "listSummaryEmbeddingPending"
      ),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default projectSchema;
