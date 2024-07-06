import { a } from "@aws-amplify/backend";

const personSchmema = {
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
};

export default personSchmema;
