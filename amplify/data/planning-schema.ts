import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "WeeklyPlan",
  "WeeklyPlanProject",
  "DailyPlan",
  "DailyPlanTodo",
  "DailyPlanProject",
];

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
      todos: a.hasMany("DailyPlanTodo", "dailyPlanId"),
      projects: a.hasMany("DailyPlanProject", "dailyPlanId"),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["day"]).queryField("listByStatus"),
    ])
    .authorization((allow) => [allow.owner()]),
  DailyPlanProject: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      dailyPlanId: a.id().required(),
      dailyPlan: a.belongsTo("DailyPlan", "dailyPlanId"),
      projectId: a.id().required(),
      project: a.belongsTo("Projects", "projectId"),
      maybe: a.boolean(),
      updatedAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("projectId").sortKeys(["updatedAt"]).queryField("listByProjectId"),
    ])
    .authorization((allow) => [allow.owner()]),
  DailyPlanTodo: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      dailyPlanId: a.id().required(),
      dailyPlan: a.belongsTo("DailyPlan", "dailyPlanId"),
      todoId: a.id().required(),
      todo: a.belongsTo("Todo", "todoId"),
      postPoned: a.boolean(),
      updatedAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("todoId").sortKeys(["updatedAt"]).queryField("listByTodoId"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default planningSchema;
