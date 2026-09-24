import { defineFunction } from "@aws-amplify/backend";

/**
 * Server-side project vector search, backing the Sonic `suggest_project` tool.
 * Runs SearchVectors against the Projects summary-embedding vector index scoped
 * to the caller's own `owner` (derived server-side from the Cognito identity,
 * never from client input).
 *
 * WHY server-side (same as person-vector-search): DynamoDB SearchVectors does
 * NOT honor fine-grained access control, so it can't be called from the browser
 * in a multi-tenant table. This Lambda enforces the owner filter itself, and it
 * is the authority for which projectId a spoken/heard project maps to — the
 * client no longer matches projects locally.
 */
export const projectVectorSearch = defineFunction({
  name: "project-vector-search",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 15,
  logging: { retention: "1 week" },
});
