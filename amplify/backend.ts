import { defineBackend } from "@aws-amplify/backend";
import { RemovalPolicy } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const dataResources = backend.data.resources;

Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach(
  (table) => {
    table.pointInTimeRecoveryEnabled = true;
    table.deletionProtectionEnabled = true;
    table.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
);
