import { a } from "@aws-amplify/backend";

const planningSchema = {
  PlanningStatus: a.enum(["WIP", "DONE", "CANCELLED"]),
  DailyPlanStatus: a.enum(["PLANNING", "OPEN", "DONE", "CANCELLED"]),
  WeeklyPlan: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      startDate: a.date().required(),
      status: a.ref("PlanningStatus").required(),
      projects: a.hasMany("WeeklyPlanProject", "weekPlanId"),
    })
    .secondaryIndexes((index) => [index("status")])
    .authorization((allow) => [allow.owner()]),
  WeeklyPlanProject: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      weekPlanId: a.id().required(),
      weekPlan: a.belongsTo("WeeklyPlan", "weekPlanId"),
      projectId: a.id().required(),
      project: a.belongsTo("Projects", "projectId"),
    })
    .authorization((allow) => [allow.owner()]),
  DailyPlan: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      day: a.date().required(),
      dayGoal: a.string().required(),
      context: a.ref("Context").required(),
      status: a.ref("DailyPlanStatus").required(),
      tasks: a.hasMany("DailyPlanTask", "dailyPlanId"),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["day"]).queryField("listByStatus"),
    ])
    .authorization((allow) => [allow.owner()]),
  DailyPlanTask: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      dailyPlanId: a.id().required(),
      dailyPlan: a.belongsTo("DailyPlan", "dailyPlanId"),
      activityId: a.id().required(),
      activity: a.belongsTo("Activity", "activityId"),
      taskIndex: a.integer().required(),
      isInFocus: a.boolean().required(),
      task: a.json().required(),
    })
    .identifier(["dailyPlanId", "activityId", "taskIndex"])
    .authorization((allow) => [allow.owner()]),
};

export default planningSchema;
