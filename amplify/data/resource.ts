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
import {
  processExportTasks,
  scheduleRecurringExports,
  manageExportPermissions,
  cleanupExportPermissions,
} from "../functions/process-export-tasks/resource";

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
        // Cached, context-free meeting header (no leading '#'; export routines
        // add the heading level). Regenerated on a 5-min debounce whenever the
        // meeting's topic/time, its participants, or the @-mentions in any of
        // its activities' notes change. Shape:
        //   "<de date>, Meeting: <topic>"
        //   "**Participants:** Name (Company, Role), …"
        //   "**People mentioned:** …"  (mentioned but not participating,
        //                                deduped across the meeting's activities)
        meetingHeaderMarkdown: a.string(),
        meetingHeaderMarkdownUpdatedAt: a.datetime(),
        // --- Nova Sonic live-transcription usage (Etappe 1) ---------------
        // Written by the client after a live transcription session so we can
        // observe real cost per meeting and reconcile against Cost Explorer a
        // few days later. Duration is wall-clock seconds the Sonic stream was
        // open; token counts are the cumulative totals from the final
        // usageEvent; the estimated cost is computed client-side from the
        // per-token rates (kept alongside the raw tokens so a later rate
        // change doesn't invalidate the stored figure).
        sonicSessionCount: a.integer(),
        sonicDurationSeconds: a.integer(),
        sonicInputSpeechTokens: a.integer(),
        sonicInputTextTokens: a.integer(),
        sonicOutputSpeechTokens: a.integer(),
        sonicOutputTextTokens: a.integer(),
        sonicEstimatedCostUsd: a.float(),
        sonicUsageUpdatedAt: a.datetime(),
        participants: a.hasMany("MeetingParticipant", "meetingId"),
        activities: a.hasMany("Activity", "meetingActivitiesId"),
      })
      .authorization((allow) => [allow.owner()]),
  })
  .authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(processExportTasks),
    allow.resource(scheduleRecurringExports),
    allow.resource(manageExportPermissions),
    allow.resource(cleanupExportPermissions),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
