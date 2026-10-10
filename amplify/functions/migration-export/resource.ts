import { defineFunction } from "@aws-amplify/backend";

/**
 * Migration export for nexflow.it (board 9q33.5a2k). Invoked asynchronously by
 * the `startMigrationExport` mutation; reads the caller's data directly from
 * DynamoDB and S3 and writes a ZIP to the caller's exports folder. Wiring
 * (table names, IAM, ephemeral storage) lives in
 * custom/backend/migration-export.ts.
 */
export const migrationExport = defineFunction({
  name: "migration-export",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  memoryMB: 2048,
  timeoutSeconds: 15 * 60,
  logging: { retention: "1 week" },
});
