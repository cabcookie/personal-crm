import { a } from "@aws-amplify/backend";

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
  NoteBlock: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      content: a.json(),
      formatVersion: a.integer().required(),
      activityId: a.id().required(),
      activity: a.belongsTo("Activity", "activityId"),
      personIdsMentioned: a.string().required().array(),
      todoId: a.id(),
      todo: a.belongsTo("Todo", "todoId"),
    })
    .authorization((allow) => [allow.owner()]),
  Todo: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      todo: a.string().required(),
      status: a.ref("TodoStatus").required(),
      doneOn: a.date(),
      activity: a.hasOne("NoteBlock", "todoId"),
    })
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
      dailyTasks: a.hasMany("DailyPlanTask", "activityId"),
      noteBlocks: a.hasMany("NoteBlock", "activityId"),
      noteBlockIds: a.string().required().array(),
      hasOpenTasks: a.string().required(), // DEPRECATED
      notes: a.string(), // DEPRECATED
      notesJson: a.json(), // DEPRECATED
    })
    .secondaryIndexes((index) => [
      // DEPRECATED
      index("hasOpenTasks")
        .sortKeys(["finishedOn"])
        .queryField("listActivitiesByOpenTasks"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default activitySchema;
