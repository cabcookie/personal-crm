import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import accountSchema, {
  tablesWithDeleteProtection as accountTdp,
} from "./account-schema";
import activitySchema, {
  tablesWithDeleteProtection as activityTdp,
} from "./activity-schema";
import aiSchema from "./ai-schema";
import { tablesWithDeleteProtection as aiSchemaTdp } from "./ai-schema";
import analyticsSchema, {
  tablesWithDeleteProtection as analyticsTdp,
} from "./analytics-schema";
import bibleSchema, {
  tablesWithDeleteProtection as bibleTdp,
} from "./bible-schema";
import contextSchema, {
  tablesWithDeleteProtection as contextTdp,
} from "./context-schema";
import personSchmema, {
  tablesWithDeleteProtection as personTdp,
} from "./person-schema";
import planningSchema, {
  tablesWithDeleteProtection as planningTdp,
} from "./planning-schema";
import prayerSchema, {
  tablesWithDeleteProtection as prayerTdp,
} from "./prayer-schema";
import projectSchema, {
  tablesWithDeleteProtection as projectTdp,
} from "./project-schema";
import weeklyReviewSchema, {
  tablesWithDeleteProtection as weeklyReviewTdp,
} from "./weekly-review-schema";
import { processExportTasks } from "../functions/process-export-tasks/resource";

export const tablesWithDeleteProtection = [
  ...accountTdp,
  ...activityTdp,
  ...analyticsTdp,
  ...bibleTdp,
  ...contextTdp,
  ...personTdp,
  ...planningTdp,
  ...prayerTdp,
  ...projectTdp,
  ...weeklyReviewTdp,
  ...aiSchemaTdp,
  "Inbox",
  "Meeting",
];

const schema = a
  .schema({
    ...accountSchema,
    ...activitySchema,
    ...analyticsSchema,
    ...bibleSchema,
    ...contextSchema,
    ...personSchmema,
    ...planningSchema,
    ...prayerSchema,
    ...projectSchema,
    ...weeklyReviewSchema,
    ...aiSchema,
    LearningStatus: a.enum(["new", "archived"]),
    InboxStatus: a.enum(["new", "done"]),
    Inbox: a
      .model({
        owner: a
          .string()
          .authorization((allow) => [allow.owner().to(["read", "delete"])]),
        note: a.string(),
        formatVersion: a.integer().default(1),
        noteJson: a.json(),
        status: a.ref("InboxStatus").required(),
        movedToActivityId: a.string(),
        movedToPersonLearningId: a.string(),
        movedToAccountLearningId: a.string(),
        createdAt: a.datetime().required(),
      })
      .secondaryIndexes((inbox) => [
        inbox("status").sortKeys(["createdAt"]).queryField("byStatus"),
      ])
      .authorization((allow) => [allow.owner()]),
    Meeting: a
      .model({
        owner: a
          .string()
          .authorization((allow) => [allow.owner().to(["read", "delete"])]),
        notionId: a.integer(),
        context: a.ref("Context"),
        topic: a.string().required(),
        meetingOn: a.datetime(),
        immediateTasksDone: a.boolean(),
        participants: a.hasMany("MeetingParticipant", "meetingId"),
        activities: a.hasMany("Activity", "meetingActivitiesId"),
      })
      .authorization((allow) => [allow.owner()]),
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(processExportTasks),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
