import { defineFunction } from "@aws-amplify/backend";

export const dataSchemaMigrationsFn = defineFunction({
  name: "data-schema-migrations",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  logging: { retention: "1 week" },
  timeoutSeconds: 10 * 60, // 10 minutes
});
