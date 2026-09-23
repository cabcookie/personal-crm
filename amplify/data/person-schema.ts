import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "MeetingParticipant",
  "PersonAccount",
  "PersonDetail",
  "PersonLearning",
  "User",
  "PersonRelationship",
  "Person",
];

const personSchmema = {
  // ------ Enums
  PersonDetailsEnum: a.enum([
    "linkedIn",
    "phonePrivate",
    "phoneWork",
    "emailPrivate",
    "emailWork",
    "salesforce",
    "instagram",
    "amazonalias",
  ]),

  RelationshipTypeEnum: a.enum([
    "parent",
    "child",
    "spouse",
    "fiance",
    "partner",
    "friend",
    "smallgroup",
    "manager",
    "employer",
  ]),

  // ------ Models
  MeetingParticipant: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      createdAt: a.datetime().required(),
      // FKs
      meetingId: a.id().required(),
      personId: a.id().required(),
      // relations
      meeting: a.belongsTo("Meeting", "meetingId"),
      person: a.belongsTo("Person", "personId"),
    })
    .secondaryIndexes((index) => [index("personId").sortKeys(["createdAt"])])
    .authorization((allow) => [allow.owner()]),

  PersonAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      startDate: a.date(),
      endDate: a.date(),
      position: a.string(),
      // FKs
      personId: a.id().required(),
      accountId: a.id().required(),
      // relations
      person: a.belongsTo("Person", "personId"),
      account: a.belongsTo("Account", "accountId"),
    })
    .secondaryIndexes((index) => [index("accountId")])
    .authorization((allow) => [allow.owner()]),

  PersonDetail: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      label: a.ref("PersonDetailsEnum").required(),
      detail: a.string().required(),
      // FKs
      personId: a.id().required(),
      // relations
      person: a.belongsTo("Person", "personId"),
    })
    .authorization((allow) => [allow.owner()]),

  PersonLearning: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      learnedOn: a.date(),
      learning: a.json(),
      prayer: a.ref("PrayerStatus"),
      status: a.ref("LearningStatus").required(),
      // FKs
      personId: a.id().required(),
      // relations
      person: a.belongsTo("Person", "personId"),
    })
    .secondaryIndexes((index) => [index("personId")])
    .authorization((allow) => [allow.owner()]),

  User: a
    .model({
      email: a.string(),
      name: a.string(),
      profilePicture: a.string(),
      // --- AI user prompt (Tools) ---------------------------------------
      // Cross-context background the user writes about themselves ("who am
      // I"). Fed into the Nova Sonic system prompt (and later summaries) for
      // grounding. Applies to every context.
      promptGeneral: a.string(),
      // Per fixed context (work/family/hobby): what the user does there, their
      // 3-year goals, and their 12-month goals. Only the active meeting's
      // context is fed to the model at a time.
      promptWorkActivity: a.string(),
      promptWorkGoals3Years: a.string(),
      promptWorkGoals12Months: a.string(),
      promptFamilyActivity: a.string(),
      promptFamilyGoals3Years: a.string(),
      promptFamilyGoals12Months: a.string(),
      promptHobbyActivity: a.string(),
      promptHobbyGoals3Years: a.string(),
      promptHobbyGoals12Months: a.string(),
      // FKs
      profileId: a.string().required(),
      personId: a.id(),
      // relations
      person: a.belongsTo("Person", "personId"),
    })
    .identifier(["profileId"])
    .authorization((allow) => [allow.ownerDefinedIn("profileId")]),

  PersonRelationship: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      typeName: a.ref("RelationshipTypeEnum"),
      date: a.date(),
      endDate: a.date(),
      // FKs
      personId: a.id(),
      relatedPersonId: a.id(),
      // relations
      person: a.belongsTo("Person", "personId"),
      relatedPerson: a.belongsTo("Person", "relatedPersonId"),
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
      // Semantic-search vector over "Name (Company, Role)" produced by the
      // debounced person-embedding pipeline (Titan Text Embeddings v2, 1024
      // dims). Declared here so Amplify knows the attribute, but the actual
      // value is written directly to DynamoDB as a native List<Number> (`L`
      // of `N`) by the embedding Lambda — NOT through AppSync, which would
      // JSON-stringify it and make it unsearchable. A DynamoDB vector index
      // (`PersonNameEmbeddingIndex`) is created on this attribute via a CDK
      // custom resource (see custom/backend/person-embedding.ts). Never write
      // this field from the client.
      nameEmbedding: a.json(),
      nameEmbeddingUpdatedAt: a.datetime(),
      // Source text the embedding was last generated from. Lets the pipeline
      // skip re-embedding (a Bedrock call) when the semantic inputs
      // (name/company/role) did not actually change.
      nameEmbeddingSource: a.string(),
      // Backfill marker. Set to "1" by scripts/mark-people-embedding-pending.js
      // on existing Person rows that lack an embedding. The backfill worker
      // clears it once the embedding is generated. Left unset in normal
      // operation, so the GSI below is SPARSE — it holds only people still
      // awaiting a backfilled embedding.
      nameEmbeddingPending: a.string(),
      // relations
      meetings: a.hasMany("MeetingParticipant", "personId"),
      accounts: a.hasMany("PersonAccount", "personId"),
      payerAccounts: a.hasMany("PayerAccount", "mainContactId"),
      details: a.hasMany("PersonDetail", "personId"),
      learnings: a.hasMany("PersonLearning", "personId"),
      accountLearnings: a.hasMany("AccountLearningPerson", "personId"),
      profile: a.hasOne("User", "personId"),
      noteBlocks: a.hasMany("NoteBlockPerson", "personId"),
      relationshipsFrom: a.hasMany("PersonRelationship", "personId"),
      relationshipsTo: a.hasMany("PersonRelationship", "relatedPersonId"),
    })
    .secondaryIndexes((index) => [
      // Sparse work-queue index for the person-embedding backfill.
      index("nameEmbeddingPending").queryField("listNameEmbeddingPending"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default personSchmema;
