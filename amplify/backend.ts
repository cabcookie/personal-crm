import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, tablesWithDeleteProtection } from "./data/resource";
import { storage } from "./storage/resource";
import { dataSchemaMigrationsFn } from "./functions/data-schema-migrations/resource";
import { processExportTasks } from "./functions/process-export-tasks/resource";
import { setupDataSeeding } from "./custom/backend/seeding";
import { setupInferenceProfiles } from "./custom/backend/inference-schema";
import { setupDeleteProtection } from "./custom/backend/delete-protection";
import { setupExportTasks } from "./custom/backend/export-tasks";

const backend = defineBackend({
  auth,
  data,
  storage,
  dataSchemaMigrationsFn,
  processExportTasks,
});

export type BackendType = typeof backend;

// Setup data seeding and migrations
setupDataSeeding(backend);

// Setup inference profiles for Bedrock
setupInferenceProfiles(backend);

// Setup delete protection for production tables
setupDeleteProtection(backend, tablesWithDeleteProtection);

// Setup export tasks functionality
setupExportTasks(backend);
