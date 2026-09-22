import { defineFunction } from "@aws-amplify/backend";

/**
 * Custom-resource Lambda that idempotently ensures the Person.nameEmbedding
 * vector index exists (creating it after a table recreate). Wired as a
 * CloudFormation custom resource in custom/backend/project-summary.ts so it
 * runs on every Create/Update.
 */
export const ensurePersonVectorIndex = defineFunction({
  name: "ensure-person-vector-index",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});
