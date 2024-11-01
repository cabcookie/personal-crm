import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import accountSchema, {
  tablesWithDeleteProtection as accountTdp,
} from "./account-schema";
import activitySchema, {
  tablesWithDeleteProtection as activityTdp,
} from "./activity-schema";
import analyticsSchema from "./analytics-schema";
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

export const tablesWithDeleteProtection = [
  ...accountTdp,
  ...activityTdp,
  ...bibleTdp,
  ...contextTdp,
  ...personTdp,
  ...planningTdp,
  ...prayerTdp,
  ...projectTdp,
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
    Inbox: a
      .model({
        owner: a
          .string()
          .authorization((allow) => [allow.owner().to(["read", "delete"])]),
        note: a.string(),
        formatVersion: a.integer().default(1),
        noteJson: a.json(),
        status: a.id().required(),
        movedToActivityId: a.string(),
      })
      .secondaryIndexes((inbox) => [inbox("status")])
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
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
