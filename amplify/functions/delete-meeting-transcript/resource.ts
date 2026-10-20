import { defineFunction } from "@aws-amplify/backend";

/**
 * Deletes a meeting's live transcript 24h after its summary was generated.
 * Not stream-triggered: it is the target of a one-time EventBridge Scheduler
 * schedule armed by the summarize-meeting Lambda (see
 * custom/backend/summarize-meeting.ts). Receives { meetingId, owner } and
 * removes sonicTranscript / sonicTranscriptUpdatedAt from the Meeting record
 * (owner-guarded, direct DynamoDB write — never AppSync).
 */
export const deleteMeetingTranscript = defineFunction({
  name: "delete-meeting-transcript",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 60,
  logging: { retention: "1 week" },
});
