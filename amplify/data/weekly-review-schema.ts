import { a } from "@aws-amplify/backend";

// Note: Delete protection will be added in a later step due to Amplify configuration challenges
export const tablesWithDeleteProtection: string[] = [
  "WeeklyReview",
  "WeeklyReviewEntry",
];

const weeklyReviewSchema = {
  WeeklyReviewStatus: a.enum(["draft", "completed"]),
  WeeklyReviewCategory: a.enum([
    "none",
    "customer_highlights",
    "customer_lowlights",
    "market_observations",
    "genai_opportunities",
  ]),
  WeeklyReview: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      date: a.date().required(),
      status: a.ref("WeeklyReviewStatus").required(),
      entries: a.hasMany("WeeklyReviewEntry", "reviewId"),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["createdAt"]).queryField("listByWbrStatus"),
      index("date").sortKeys(["createdAt"]).queryField("listWbrByWeek"),
    ])
    .authorization((allow) => [allow.owner()]),
  WeeklyReviewEntry: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      reviewId: a.id().required(),
      review: a.belongsTo("WeeklyReview", "reviewId"),
      projectId: a.id().required(),
      project: a.belongsTo("Projects", "projectId"),
      category: a.ref("WeeklyReviewCategory").required(),
      content: a.string(),
      generatedContent: a.string(),
      isEdited: a.boolean().default(false),
    })
    .authorization((allow) => [allow.owner()]),
};

export default weeklyReviewSchema;
