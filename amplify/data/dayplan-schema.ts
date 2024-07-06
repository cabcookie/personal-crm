import { a } from "@aws-amplify/backend";

const dayPlanSchema = {
  DayPlan: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      day: a.date().required(),
      dayGoal: a.string().required(),
      context: a.ref("Context").required(),
      done: a.boolean().required(),
      tasks: a.hasMany("NonProjectTask", "dayPlanTasksId"),
      projectTasks: a.hasMany("DayProjectTask", "dayPlanProjectTasksId"),
      todos: a.hasMany("DayPlanTodo", "dayPlanTodosId"),
    })
    .authorization((allow) => [allow.owner()]),
  DayPlanTodo: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      todo: a.string().required(),
      done: a.boolean().required(),
      doneOn: a.date(),
      dayPlanTodosId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanTodosId"),
      projectsTodosId: a.id(),
      project: a.belongsTo("Projects", "projectsTodosId"),
    })
    .authorization((allow) => [allow.owner()]),
  DayProjectTask: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      task: a.string().required(),
      done: a.boolean(),
      dayPlanProjectTasksId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanProjectTasksId"),
      projectsDayTasksId: a.id(),
      projects: a.belongsTo("Projects", "projectsDayTasksId"),
    })
    .authorization((allow) => [allow.owner()]),
  NonProjectTask: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      dayPlanTasksId: a.id().required(),
      dayPlan: a.belongsTo("DayPlan", "dayPlanTasksId"),
      task: a.string().required(),
      context: a.ref("Context"),
      done: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),
};

export default dayPlanSchema;
