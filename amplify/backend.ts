import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, tablesWithDeleteProtection } from "./data/resource";
import { storage, recurringExports } from "./storage/resource";
import { dataSchemaMigrationsFn } from "./functions/data-schema-migrations/resource";
import {
  processExportTasks,
  scheduleRecurringExports,
  manageExportPermissions,
  cleanupExportPermissions,
} from "./functions/process-export-tasks/resource";
import {
  scheduleDebounce,
  generateActivitySnapshot,
  generateProjectSummary,
  generateMeetingHeader,
  describeNoteImage,
  backfillImagesEnqueue,
  backfillImagesWorker,
  backfillSnapshotsEnqueue,
  backfillSnapshotsWorker,
} from "./functions/project-summary/resource";
import { setupDataSeeding } from "./custom/backend/seeding";
import { setupInferenceProfiles } from "./custom/backend/inference-schema";
import { setupDeleteProtection } from "./custom/backend/delete-protection";
import { setupExportTasks } from "./custom/backend/export-tasks";
import { setupProjectSummary } from "./custom/backend/project-summary";

const backend = defineBackend({
  auth,
  data,
  storage,
  recurringExports,
  dataSchemaMigrationsFn,
  processExportTasks,
  scheduleRecurringExports,
  manageExportPermissions,
  cleanupExportPermissions,
  scheduleDebounce,
  generateActivitySnapshot,
  generateProjectSummary,
  generateMeetingHeader,
  describeNoteImage,
  backfillImagesEnqueue,
  backfillImagesWorker,
  backfillSnapshotsEnqueue,
  backfillSnapshotsWorker,
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

// Setup debounced project-summary / activity-snapshot / image-description
// pipelines and the one-off image-description backfill.
setupProjectSummary(backend);
