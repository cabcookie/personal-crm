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
    .authorization((allow) => [allow.owner()]),
};

export default personSchmema;
