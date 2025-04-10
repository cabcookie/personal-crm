import { a } from "@aws-amplify/backend";

const aiSchema = {
  ProjectSummaryRequestType: a.enum(["PSEUDONOMIZE", "SUMMARY"]),
  ProjectSummaryRequest: a
    .model({
      projectId: a.id(),
      project: a.belongsTo("Projects", "projectId"),
      requestType: a.ref("ProjectSummaryRequestType"),
      modelUsed: a.string(),
      response: a.json(),
    })
    .secondaryIndexes((index) => [
      index("projectId").queryField("listSummaryByProjectId"),
    ])
    .authorization((allow) => [allow.owner()]),
  ActivitySummaryRequestType: a.enum([
    "BRIEFING",
    "NEXT_ACTIONS",
    "LEARNINGS_COMPANY",
    "LEARNINGS_PERSON",
    "SUMMARY_EMAIL",
  ]),
  ActivitySummaryRequest: a
    .model({
      activityId: a.id(),
      activity: a.belongsTo("Activity", "activityId"),
      requestType: a.ref("ActivitySummaryRequestType"),
      modelUsed: a.string(),
      response: a.json(),
    })
    .secondaryIndexes((index) => [
      index("activityId").queryField("listSummaryByActivityId"),
    ])
    .authorization((allow) => [allow.owner()]),
  generalChat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: "You are a helpful assistant.",
    })
    .authorization((allow) => allow.owner()),
  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt:
        "You are a helpful assistant that writes descriptive names for conversations. Names should be 2-7 words long. The descriptive name for the conversation should be in the same language as the conversation",
    })
    .arguments({ content: a.string() })
    .returns(a.customType({ name: a.string() }))
    .authorization((allow) => [allow.authenticated()]),
};

export default aiSchema;
