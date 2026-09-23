import { defineFunction } from "@aws-amplify/backend";

/**
 * Server-side meeting summarizer. Takes the meeting payload (projects with
 * their full summaries as context, participants, mentioned people, and the
 * transcript) and asks Claude Sonnet 4.5 for a transcript-grounded meeting
 * summary as JSON.
 *
 * Server-side (not browser) so the Bedrock call is signed with the app's role
 * and the long transcript/context isn't shipped through client-side Bedrock
 * credentials. Mirrors the person-vector-search resolver pattern.
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
