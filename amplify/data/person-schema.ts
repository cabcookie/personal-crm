import { a } from "@aws-amplify/backend";

const personSchmema = {
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
  ]),
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
    .secondaryIndexes((index) => [index("personId")])
    .authorization((allow) => [allow.owner()]),
  PersonAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
      startDate: a.date(),
      endDate: a.date(),
      position: a.string(),
    })
    .secondaryIndexes((index) => [index("accountId")])
    .authorization((allow) => [allow.owner()]),
  PersonDetail: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
      label: a.ref("PersonDetailsEnum").required(),
      detail: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),
  PersonLearning: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      learnedOn: a.date(),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
      learning: a.json(),
      prayer: a.ref("PrayerStatus"),
    })
    .secondaryIndexes((index) => [index("personId")])
    .authorization((allow) => [allow.owner()]),
  User: a
    .model({
      profileId: a.string().required(),
      email: a.string(),
      name: a.string(),
      profilePicture: a.string(),
      personId: a.id(),
      person: a.belongsTo("Person", "personId"),
    })
    .identifier(["profileId"])
    .authorization((allow) => [allow.ownerDefinedIn("profileId")]),
  PersonRelationship: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      personId: a.id(),
      person: a.belongsTo("Person", "personId"),
      typeName: a.ref("RelationshipTypeEnum"),
      relatedPersonId: a.id(),
      relatedPerson: a.belongsTo("Person", "relatedPersonId"),
      date: a.date(),
      endDate: a.date(),
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
      accounts: a.hasMany("PersonAccount", "personId"),
      details: a.hasMany("PersonDetail", "personId"),
      learnings: a.hasMany("PersonLearning", "personId"),
      profile: a.hasOne("User", "personId"),
      noteBlocks: a.hasMany("NoteBlockPerson", "personId"),
      relationshipsFrom: a.hasMany("PersonRelationship", "personId"),
      relationshipsTo: a.hasMany("PersonRelationship", "relatedPersonId"),
    })
    .authorization((allow) => [allow.owner()]),
};

export default personSchmema;
