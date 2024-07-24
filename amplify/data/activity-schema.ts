import { a } from "@aws-amplify/backend";

const activitySchema = {
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
  Activity: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      notes: a.string(),
      formatVersion: a.integer().default(1),
      notesJson: a.json(),
      hasOpenTasks: a.string().required(),
      openTasks: a.json(),
      closedTasks: a.json(),
      forProjects: a.hasMany("ProjectActivity", "activityId"),
      meetingActivitiesId: a.id(),
      forMeeting: a.belongsTo("Meeting", "meetingActivitiesId"),
      finishedOn: a.datetime(),
      dailyTasks: a.hasMany("DailyPlanTask", "activityId"),
    })
    .secondaryIndexes((index) => [
      index("hasOpenTasks")
        .sortKeys(["finishedOn"])
        .queryField("listActivitiesByOpenTasks"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default activitySchema;
