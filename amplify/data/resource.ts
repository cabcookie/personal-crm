import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import accountSchema from "./account-schema";
import activitySchema from "./activity-schema";
import analyticsSchema from "./analytics-schema";
import bibleSchema from "./bible-schema";
import contextSchema from "./context-schema";
import personSchmema from "./person-schema";
import planningSchema from "./planning-schema";
import prayerSchema from "./prayer-schema";
import projectSchema from "./project-schema";

const schema = a
  .schema({
    ...accountSchema,
    ...activitySchema,
    ...contextSchema,
    ...personSchmema,
    ...projectSchema,
    ...prayerSchema,
    ...planningSchema,
    ...bibleSchema,
    ...analyticsSchema,
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
