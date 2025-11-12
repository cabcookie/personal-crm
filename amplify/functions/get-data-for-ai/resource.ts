import { defineFunction } from "@aws-amplify/backend";

export const getDataForAiFn = defineFunction({
  name: "get-data-for-ai",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  logging: { retention: "1 week" },
  timeoutSeconds: 10 * 60, // 10 minutes
});
