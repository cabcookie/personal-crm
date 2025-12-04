import { defineFunction } from "@aws-amplify/backend";

export const processExportTasks = defineFunction({
  name: "process-export-tasks",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 15 * 60, // 15 minutes
  logging: {
    retention: "1 week",
  },
});
