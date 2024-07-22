import { a } from "@aws-amplify/backend";

const planningSchema = {
  PlanningStatus: a.enum(["WIP", "DONE", "CANCELLED"]),
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
};

export default planningSchema;
