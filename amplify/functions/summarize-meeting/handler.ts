import type { DynamoDBStreamEvent } from "aws-lambda";
import { converseText } from "../project-summary/lib/bedrock";
import { ClaudeSonnetUs } from "../../data/models";
import { updateItemAttributes } from "../project-summary/lib/ddb-write";
import { meetingSummaryPrompt } from "../../data/prompts/meeting-summary";
import {
  fetchMentionedPeople,
  fetchParticipants,
  fetchTopicActivities,
  fetchTopics,
  loadMeeting,
} from "./lib/load-meeting-context";
import { loadPendingSummaryRecord, SkipRecordError } from "./lib/load-record";
import {
  applySummaryToActivities,
  type MeetingSummary,
} from "./lib/apply-summary";

/** Strip accidental ```json fences if the model adds them. */
const stripFences = (s: string): string =>
  s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

/**
 * Read sonicTranscript (an a.json() field) which DynamoDB may return as a
 * native list or as a JSON string ('[{...}]') depending on how it was
 * written — accept both.
 */
const parseTranscriptLines = (value: unknown): { text?: string }[] => {
  const raw =
    typeof value === "string"
      ? (() => {
          try {
            return JSON.parse(value);
          } catch {
            return null;
          }
        })()
      : value;
  return Array.isArray(raw) ? (raw as { text?: string }[]) : [];
};

/**
 * Mark a summary run as failed. Swallows its own write errors (logs only) so
 * a failure writing the failure doesn't mask the original error.
 */
const markAsFailed = async (meetingId: string, message: string) => {
  console.error(`[summarize-meeting] ${meetingId} failed: ${message}`);
  try {
    await updateItemAttributes("Meeting", meetingId, {
      sonicSummaryStatus: "ERROR",
      sonicSummaryError: message,
    });
  } catch (err) {
    console.error(
      `[summarize-meeting] ${meetingId} failed to write ERROR status`,
      err
    );
  }
};

/**
 * Run one meeting's summary: load topics (the meeting's Activities' linked
 * projects), participants (always including the meeting owner's own linked
 * person), and mentioned-but-not-participating people (confirmed during the
 * live transcription, ids passed by the client) directly from DynamoDB, ask
 * Sonnet for a transcript-grounded summary, and write the result back.
 */
const runSummary = async (meetingId: string, owner: string): Promise<void> => {
  const meeting = await loadMeeting(meetingId);
  if (!meeting) {
    console.warn(`[summarize-meeting] meeting ${meetingId} not found`);
    return;
  }
  const transcriptLines = parseTranscriptLines(meeting.sonicTranscript);
  const transcriptText = transcriptLines
    .map((l) => l.text ?? "")
    .filter(Boolean)
    .join("\n");
  if (!transcriptText.trim()) {
    await markAsFailed(meetingId, "No transcript recorded for this meeting.");
    return;
  }

  const ownerSub = owner.split("::")[0];
  const [topics, { people: participants, ids: participantIds }] =
    await Promise.all([
      fetchTopics(meetingId, { owner }),
      fetchParticipants(meetingId, ownerSub, { owner }),
    ]);
  const mentionedPeople = await fetchMentionedPeople(
    meeting.sonicMentionedPersonIds,
    participantIds,
    { owner }
  );

  if (!topics.length) {
    // Defence in depth: the client-side button is disabled without topics,
    // but a direct status write should still be rejected cleanly.
    await markAsFailed(
      meetingId,
      "This meeting has no topics (projects) added yet."
    );
    return;
  }

  const payload = {
    topics,
    participants,
    mentionedPeople,
    transcript: transcriptText,
  };

  const raw = await converseText({
    modelId: ClaudeSonnetUs.resourcePath,
    systemPrompt: meetingSummaryPrompt,
    content: [{ text: JSON.stringify(payload) }],
    maxTokens: 4096,
  });

  const cleaned = stripFences(raw);
  let summary: unknown;
  try {
    summary = JSON.parse(cleaned);
  } catch {
    await markAsFailed(
      meetingId,
      "The model did not return valid JSON for this meeting."
    );
    return;
  }

  // Persist the summary first so a transfer failure doesn't lose the result.
  await updateItemAttributes("Meeting", meetingId, {
    sonicSummary: summary,
    sonicSummaryStatus: "DONE",
    sonicSummaryError: undefined,
  });
  console.log(`[summarize-meeting] wrote summary for meeting ${meetingId}`);

  // Transfer the summary into each topic's Activity notes, then mark the
  // meeting APPLIED (the terminal "summarized & filed" state the UI uses to
  // retire the recording/summary controls and detection pills).
  const topicActivities = await fetchTopicActivities(meetingId, { owner });
  const applied = await applySummaryToActivities(
    summary as MeetingSummary,
    topicActivities,
    { owner }
  );
  console.log(
    `[summarize-meeting] applied summary to ${applied} topic activit${applied === 1 ? "y" : "ies"} for meeting ${meetingId}`
  );
  await updateItemAttributes("Meeting", meetingId, {
    sonicSummaryStatus: "APPLIED",
  });
};

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  for (const record of event.Records) {
    let task;
    try {
      task = loadPendingSummaryRecord(record);
    } catch (err) {
      if (err instanceof SkipRecordError) continue;
      console.error("[summarize-meeting] failed to parse stream record", err);
      continue;
    }
    try {
      await runSummary(task.meetingId, task.owner);
    } catch (err) {
      await markAsFailed(task.meetingId, errorMessage(err));
    }
  }
};
