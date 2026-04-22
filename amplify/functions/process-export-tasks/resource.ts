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

export const scheduleRecurringExports = defineFunction({
  name: "schedule-recurring-exports",
  entry: "./schedule-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 5 * 60, // 5 minutes - just queries and creates tasks
  logging: {
    retention: "1 week",
  },
});

export const manageExportPermissions = defineFunction({
  name: "manage-export-permissions",
  entry: "./permission-handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 2 * 60, // 2 minutes - modifies bucket policy
  logging: {
    retention: "1 week",
  },
});
