import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import accountSchema from "./account-schema";
import activitySchema from "./activity-schema";
import contextSchema from "./context-schema";
import dayPlanSchema from "./dayplan-schema";
import personSchmema from "./person-schema";
import planningSchema from "./planning-schema";
import prayerSchema from "./prayer-schema";
import projectSchema from "./project-schema";

const schema = a
  .schema({
    ...accountSchema,
    ...activitySchema,
    ...contextSchema,
    ...dayPlanSchema,
    ...personSchmema,
    ...projectSchema,
    ...prayerSchema,
    ...planningSchema,
    Inbox: a
      .model({
        owner: a
          .string()
          .authorization((allow) => [allow.owner().to(["read", "delete"])]),
        note: a.string(),
        formatVersion: a.integer().default(1),
        noteJson: a.json(),
        hasOpenTasks: a.string().required(),
        openTasks: a.json(),
        closedTasks: a.json(),
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
