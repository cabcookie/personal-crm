import { defineBackend } from "@aws-amplify/backend";
// import { RemovalPolicy } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

// const backend = defineBackend({
defineBackend({
  auth,
  data,
  storage,
});

// const backendType = backend.auth.resources.userPool.node.tryGetContext(
//   "amplify-backend-type"
// );
// if (backendType !== "sandbox") {
//   const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;

//   /**
//    * Ensure that new tables when moved into production will at first not have
//    * deletion protection and backup enabled. CloudFormation always runs into
//    * issues when enabled right from the get-go and Amplify deployments fail.
//    */
//   // const { PersonRelationship: _pr, ...restTables } = amplifyDynamoDbTables;

//   Object.values(amplifyDynamoDbTables).forEach((table) => {
//     table.pointInTimeRecoveryEnabled = true;
//     table.deletionProtectionEnabled = true;
//     table.applyRemovalPolicy(RemovalPolicy.RETAIN);
//   });
// }
