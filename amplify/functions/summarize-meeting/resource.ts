import { defineFunction } from "@aws-amplify/backend";

/**
 * Server-side meeting summarizer. Triggered by a DynamoDB stream on the
 * Meeting table (see custom/backend/summarize-meeting.ts) when
 * `sonicSummaryStatus` transitions to "PENDING". Resolves the meeting's
 * topics (the projects added as Activities) and participants (always
 * including the owner's own linked person) directly from DynamoDB, asks
 * Claude Sonnet for a transcript-grounded summary, and writes the result (or
 * an error) back onto the Meeting record — never through AppSync, so the
 * result is never double-JSON-encoded and `owner` is never touched.
 */
export const summarizeMeeting = defineFunction({
  name: "summarize-meeting",
  entry: "./handler.ts",
  resourceGroupName: "data",
  runtime: 22,
  architecture: "arm64",
  timeoutSeconds: 2 * 60,
  logging: { retention: "1 week" },
});
