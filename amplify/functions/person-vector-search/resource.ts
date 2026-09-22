import { defineFunction } from "@aws-amplify/backend";

/**
 * Server-side person vector search, backing the Sonic `report_detected_person`
 * tool. Runs SearchVectors against the Person vector index scoped to the
 * caller's own `owner` (derived server-side from the Cognito identity, never
 * from client input).
 *
 * WHY server-side: DynamoDB SearchVectors does NOT honor fine-grained access
 * control (dynamodb:LeadingKeys et al.), so it cannot be safely called from
 * the browser in a multi-tenant table — a client could search another tenant's
 * people. This Lambda enforces the owner filter itself.
 */
export const personVectorSearch = defineFunction({
  name: "person-vector-search",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 15,
  logging: { retention: "1 week" },
});
