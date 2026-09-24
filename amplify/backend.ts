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
  generatePersonEmbedding,
  generateProjectEmbedding,
  backfillImagesEnqueue,
  backfillImagesWorker,
  backfillSnapshotsEnqueue,
  backfillSnapshotsWorker,
  backfillPersonEmbeddingEnqueue,
  backfillPersonEmbeddingWorker,
  backfillProjectEmbeddingEnqueue,
  backfillProjectEmbeddingWorker,
} from "./functions/project-summary/resource";
import { setupDataSeeding } from "./custom/backend/seeding";
import { setupInferenceProfiles } from "./custom/backend/inference-schema";
import { setupDeleteProtection } from "./custom/backend/delete-protection";
import { setupExportTasks } from "./custom/backend/export-tasks";
import { setupProjectSummary } from "./custom/backend/project-summary";
import { personVectorSearch } from "./functions/person-vector-search/resource";
import { setupPersonVectorSearch } from "./custom/backend/person-vector-search";
import { ensurePersonVectorIndex } from "./functions/person-vector-index/resource";
import { summarizeMeeting } from "./functions/summarize-meeting/resource";
import { setupSummarizeMeeting } from "./custom/backend/summarize-meeting";
import { touchPersonLastSeen } from "./functions/touch-person-last-seen/resource";
import { setupTouchPersonLastSeen } from "./custom/backend/touch-person-last-seen";
import { projectVectorSearch } from "./functions/project-vector-search/resource";
import { setupProjectVectorSearch } from "./custom/backend/project-vector-search";
import { ensureProjectVectorIndex } from "./functions/project-vector-index/resource";

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
  generatePersonEmbedding,
  generateProjectEmbedding,
  backfillImagesEnqueue,
  backfillImagesWorker,
  backfillSnapshotsEnqueue,
  backfillSnapshotsWorker,
  backfillPersonEmbeddingEnqueue,
  backfillPersonEmbeddingWorker,
  backfillProjectEmbeddingEnqueue,
  backfillProjectEmbeddingWorker,
  personVectorSearch,
  ensurePersonVectorIndex,
  summarizeMeeting,
  touchPersonLastSeen,
  projectVectorSearch,
  ensureProjectVectorIndex,
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

// Grant the person-vector-search resolver Lambda access to the Person table +
// vector index + Titan embeddings, and let the authenticated Cognito role
// reach Bedrock Nova Sonic directly from the browser.
setupPersonVectorSearch(backend);

// Grant the project-vector-search resolver Lambda access to the Projects table
// + vector index + Titan embeddings (Sonic `suggest_project` tool).
setupProjectVectorSearch(backend);

// Grant the meeting-summarizer resolver Lambda access to Bedrock (Sonnet 4.5).
setupSummarizeMeeting(backend);

// Maintain Person.lastSeen off the MeetingParticipant / NoteBlockPerson streams
// (powers the "recently seen people" initial set).
setupTouchPersonLastSeen(backend);
