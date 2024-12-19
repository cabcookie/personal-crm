import { defineBackend } from "@aws-amplify/backend";
import { RemovalPolicy } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data, tablesWithDeleteProtection } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

/**
 * Ensure that when new tables are moved into production, they do not initially
 * have Delete Protection and Backup enabled. CloudFormation always runs into
 * problems if these options are enabled from the start, and Amplify deployments
 * will fail.
 *
 * Therefore, we keep a list of `tablesWithDeleteProtection` in each schema and
 * have to manually add the tables we want to enable delete protection for.
 *
 * In sandbox environments, we also need to disable delete protection for tables
 * where we change indexes, as the tables will be dropped and re-created, as this
 * is faster than deleting and creating indexes. With delete protection enabled
 * for such tables, deployments will fail. This happens when we add indexes
 * ourselves, but also when we add/change relations to other tables, as this
 * causes indexes to be created as well.
 */

const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
const backendType = backend.auth.resources.userPool.node.tryGetContext(
  "amplify-backend-type"
);

/**
 * keep only the properties (table names) of amplifyDynamoDbTables for which
 * their key name is in tablesWithDeleteProtection
 */

Object.keys(amplifyDynamoDbTables).forEach((key) => {
  const setting = tablesWithDeleteProtection.includes(key);
  if (!setting)
    console.log(
      `Not setting delete protection and point-in-time recovery for ${key}`
    );
  amplifyDynamoDbTables[key].deletionProtectionEnabled =
    backendType === "sandbox" ? false : setting;
  amplifyDynamoDbTables[key].pointInTimeRecoveryEnabled = setting;
  amplifyDynamoDbTables[key].applyRemovalPolicy(RemovalPolicy.RETAIN);
});
