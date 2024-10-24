import { a } from "@aws-amplify/backend";

const analyticsSchema = {
  AnalyticsImportStatus: a.enum(["WIP", "DONE"]),
  MrrImportData: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      s3Key: a.string().required(),
      status: a.ref("AnalyticsImportStatus").required(),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [
      index("status").sortKeys(["createdAt"]).queryField("listByImportStatus"),
    ])
    .authorization((allow) => [allow.owner()]),
};

export default analyticsSchema;
