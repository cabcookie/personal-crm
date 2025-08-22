import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "ProjectActivity",
  "NoteBlockPerson",
  "NoteBlock",
  "Todo",
  "Activity",
];

const activitySchema = {
  // ------- Enums
  TodoStatus: a.enum(["OPEN", "DONE"]),

  // ------- Models
  ProjectActivity: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      // FKs
      activityId: a.id().required(),
      projectsId: a.id().required(),
      // relations
      activity: a.belongsTo("Activity", "activityId"),
      projects: a.belongsTo("Projects", "projectsId"),
    })
    .secondaryIndexes((index) => [index("projectsId")])
    .authorization((allow) => [allow.owner()]),

  NoteBlockPerson: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      createdAt: a.datetime().required(),
      // FKs
      personId: a.id().required(),
      noteBlockId: a.id().required(),
      // relations
      person: a.belongsTo("Person", "personId"),
      noteBlock: a.belongsTo("NoteBlock", "noteBlockId"),
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
      // FKs
      activityId: a.id().required(),
      todoId: a.id(),
      // relations
      activity: a.belongsTo("Activity", "activityId"),
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
      // relations
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
      name: a.string(),
      notionId: a.integer(),
      formatVersion: a.integer().default(1),
      finishedOn: a.datetime(),
      notes: a.string(), // DEPRECATED
      notesJson: a.json(), // DEPRECATED
      // FKs
      meetingActivitiesId: a.id(),
      noteBlockIds: a.string().required().array(),
      // relations
      forProjects: a.hasMany("ProjectActivity", "activityId"),
      forMeeting: a.belongsTo("Meeting", "meetingActivitiesId"),
      noteBlocks: a.hasMany("NoteBlock", "activityId"),
    })
    .authorization((allow) => [allow.owner()]),
};

export default activitySchema;
