import { defineFunction } from "@aws-amplify/backend";

export const pseudonomizeProject = defineFunction({
  timeoutSeconds: 900,
  resourceGroupName: "data",
});
