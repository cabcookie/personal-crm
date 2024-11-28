import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "ProjectActivity",
  "NoteBlockPerson",
  "NoteBlock",
  "Todo",
  "Activity",
];

const activitySchema = {
  TodoStatus: a.enum(["OPEN", "DONE"]),
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
  NoteBlockPerson: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      personId: a.id().required(),
      person: a.belongsTo("Person", "personId"),
      noteBlockId: a.id().required(),
      noteBlock: a.belongsTo("NoteBlock", "noteBlockId"),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("personId").sortKeys(["createdAt"]).queryField("listByPersonId"),
    ])
    .authorization((allow) => [allow.owner()]),
  NoteBlock: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      content: a.json(),
      type: a.string().required(),
      formatVersion: a.integer().required(),
      activityId: a.id().required(),
      activity: a.belongsTo("Activity", "activityId"),
      todoId: a.id(),
      todo: a.belongsTo("Todo", "todoId"),
      people: a.hasMany("NoteBlockPerson", "noteBlockId"),
    })
    .secondaryIndexes((index) => [index("type")])
    .authorization((allow) => [allow.owner()]),
  Todo: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      todo: a.json().required(),
      status: a.ref("TodoStatus").required(),
      doneOn: a.date(),
      activity: a.hasOne("NoteBlock", "todoId"),
      dailyTodos: a.hasMany("DailyPlanTodo", "todoId"),
    })
    .secondaryIndexes((index) => [index("status")])
    .authorization((allow) => [allow.owner()]),
  Activity: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      formatVersion: a.integer().default(1),
      forProjects: a.hasMany("ProjectActivity", "activityId"),
      meetingActivitiesId: a.id(),
      forMeeting: a.belongsTo("Meeting", "meetingActivitiesId"),
      finishedOn: a.datetime(),
      noteBlocks: a.hasMany("NoteBlock", "activityId"),
      noteBlockIds: a.string().required().array(),
      notes: a.string(), // DEPRECATED
      notesJson: a.json(), // DEPRECATED
    })
    .authorization((allow) => [allow.owner()]),
};

export default activitySchema;
