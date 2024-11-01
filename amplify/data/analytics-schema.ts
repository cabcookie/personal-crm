import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "MrrDataUpload",
  "Month",
  "PayerAccountMrr",
];

const analyticsSchema = {
  AnalyticsImportStatus: a.enum(["WIP", "DONE"]),
  MrrDataUpload: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      s3Key: a.string().required(),
      status: a.ref("AnalyticsImportStatus").required(),
      latestMonths: a.hasMany("Month", "latestUploadId"),
      payerMrrs: a.hasMany("PayerAccountMrr", "uploadId"),
      createdAt: a.datetime().required(),
    })
    .secondaryIndexes((index) => [index("status").sortKeys(["createdAt"])])
    .authorization((allow) => [allow.owner()]),
  Month: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      month: a.string().required(),
      latestUploadId: a.id().required(),
      latestUpload: a.belongsTo("MrrDataUpload", "latestUploadId"),
      payerMrrs: a.hasMany("PayerAccountMrr", "monthId"),
    })
    .secondaryIndexes((index) => [index("latestUploadId").sortKeys(["month"])])
    .authorization((allow) => [allow.owner()]),
  PayerAccountMrr: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      uploadId: a.id().required(),
      upload: a.belongsTo("MrrDataUpload", "uploadId"),
      monthId: a.id().required(),
      month: a.belongsTo("Month", "monthId"),
      companyName: a.string().required(),
      awsAccountNumber: a.id().required(),
      payerAccount: a.belongsTo("PayerAccount", "awsAccountNumber"),
      isEstimated: a.boolean().required(),
      isReseller: a.boolean().required(),
      mrr: a.integer(),
    })
    .secondaryIndexes((index) => [index("uploadId")])
    .authorization((allow) => [allow.owner()]),
};

export default analyticsSchema;
