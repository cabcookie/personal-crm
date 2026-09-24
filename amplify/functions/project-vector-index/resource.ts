import { defineFunction } from "@aws-amplify/backend";

/**
 * Custom-resource Lambda that idempotently ensures the Projects.summaryEmbedding
 * vector index exists (creating it after a table recreate). Wired as a
 * CloudFormation custom resource in custom/backend/project-summary.ts so it
 * runs on every Create/Update. Mirrors ensure-person-vector-index.
 */
export const ensureProjectVectorIndex = defineFunction({
  name: "ensure-project-vector-index",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});
