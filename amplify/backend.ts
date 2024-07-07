import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { RemovalPolicy } from "aws-cdk-lib";

const backend = defineBackend({
  auth,
  data,
});

const dataResources = backend.data.resources;

Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach(
  (table) => {
    table.pointInTimeRecoveryEnabled = true;
    table.deletionProtectionEnabled = true;
    table.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
);
