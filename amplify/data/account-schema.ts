import { a } from "@aws-amplify/backend";

const accountSchema = {
  TerritoryResponsibility: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      territoryId: a.id().required(),
      territory: a.belongsTo("Territory", "territoryId"),
      startDate: a.date().required(),
      quota: a.integer().default(0),
    })
    .authorization((allow) => [allow.owner()]),
  Territory: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      name: a.string(),
      crmId: a.string(),
      responsibilities: a.hasMany("TerritoryResponsibility", "territoryId"),
      accounts: a.hasMany("AccountTerritory", "territoryId"),
    })
    .authorization((allow) => [allow.owner()]),
  AccountTerritory: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
      territoryId: a.id().required(),
      territory: a.belongsTo("Territory", "territoryId"),
    })
    .authorization((allow) => [allow.owner()]),
  PayerAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      awsAccountNumber: a.id().required(),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
    })
    .identifier(["awsAccountNumber"])
    .authorization((allow) => [allow.owner()]),
  Account: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      notionId: a.integer(),
      name: a.string().required(),
      order: a.integer(),
      introduction: a.string(),
      introductionJson: a.json(),
      formatVersion: a.integer().default(1),
      crmId: a.string(),
      subsidiaries: a.hasMany("Account", "accountSubsidiariesId"),
      territories: a.hasMany("AccountTerritory", "accountId"),
      projects: a.hasMany("AccountProjects", "accountId"),
      accountSubsidiariesId: a.id(),
      controller: a.belongsTo("Account", "accountSubsidiariesId"),
      payerAccounts: a.hasMany("PayerAccount", "accountId"),
      people: a.hasMany("PersonAccount", "accountId"),
      partnerProjects: a.hasMany("Projects", "partnerId"),
    })
    .authorization((allow) => [allow.owner()]),
};

export default accountSchema;
