import { a } from "@aws-amplify/backend";

export const tablesWithDeleteProtection = [
  "TerritoryResponsibility",
  "Territory",
  "AccountTerritory",
  "AccountPayerAccount",
  "PayerAccount",
  "Account",
];

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
  AccountPayerAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      accountId: a.id().required(),
      account: a.belongsTo("Account", "accountId"),
      awsAccountNumberId: a.id().required(),
      awsAccountNumber: a.belongsTo("PayerAccount", "awsAccountNumberId"),
    })
    .secondaryIndexes((index) => [index("awsAccountNumberId")])
    .authorization((allow) => [allow.owner()]),
  PayerAccount: a
    .model({
      owner: a
        .string()
        .authorization((allow) => [allow.owner().to(["read", "delete"])]),
      awsAccountNumber: a.id().required(),
      accounts: a.hasMany("AccountPayerAccount", "awsAccountNumberId"),
      isViaReseller: a.boolean(),
      resellerId: a.id(),
      reseller: a.belongsTo("Account", "resellerId"),
      notes: a.string(),
      mainContactId: a.id(),
      mainContact: a.belongsTo("Person", "mainContactId"),
      financials: a.hasMany("PayerAccountMrr", "awsAccountNumber"),
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
      shortName: a.string(),
      mainColor: a.string(),
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
      awsAccounts: a.hasMany("AccountPayerAccount", "accountId"),
      resellingAccounts: a.hasMany("PayerAccount", "resellerId"),
      people: a.hasMany("PersonAccount", "accountId"),
      partnerProjects: a.hasMany("Projects", "partnerId"),
    })
    .authorization((allow) => [allow.owner()]),
};

export default accountSchema;
