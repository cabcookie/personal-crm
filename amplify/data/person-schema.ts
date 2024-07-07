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
      learnedOn: a.datetime(),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
      learning: a.json(),
    })
    .secondaryIndexes((index) => [index("personId")])
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
    })
    .authorization((allow) => [allow.owner()]),
};

export default personSchmema;
