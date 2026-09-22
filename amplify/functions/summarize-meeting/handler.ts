import { converseText } from "../project-summary/lib/bedrock";
import { ClaudeSonnet45Us } from "../../data/models";
import { meetingSummaryPrompt } from "../../data/prompts/meeting-summary";

/**
 * `summarizeMeeting` resolver. Receives the meeting payload as a JSON string
 * argument, asks Sonnet 4.5 for a transcript-grounded summary, and returns the
 * model's JSON (as a string). Requires an authenticated caller; the payload is
 * about the caller's own meeting (no cross-tenant data is read here).
 *
 * Argument: `payload` — JSON string with { projects, participants,
 * mentionedPeople, transcript }.
 * Returns: JSON string (the meeting summary object).
 */

type AppSyncIdentity = {
  sub?: string;
  username?: string;
  claims?: { sub?: string; "cognito:username"?: string };
};

type Event = {
  arguments?: { payload?: string };
  identity?: AppSyncIdentity;
};

const hasIdentity = (identity?: AppSyncIdentity): boolean =>
  !!(identity?.sub ?? identity?.claims?.sub);

/** Strip accidental ```json fences if the model adds them. */
const stripFences = (s: string): string =>
  s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

export const handler = async (event: Event): Promise<string> => {
  if (!hasIdentity(event.identity)) {
    throw new Error("Unauthenticated: cannot summarize meeting");
  }
  const payload = (event.arguments?.payload ?? "").trim();
  if (!payload) {
    return JSON.stringify({ projects: [], generalNotes: [] });
  }

  const raw = await converseText({
    modelId: ClaudeSonnet45Us.resourcePath,
    systemPrompt: meetingSummaryPrompt,
    content: [{ text: payload }],
    maxTokens: 4096,
    temperature: 0.2,
  });

  const cleaned = stripFences(raw);
  // Validate it parses; if the model returned something odd, surface the raw
  // text under a fallback shape so the client can still show it.
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    return JSON.stringify({ projects: [], generalNotes: [], raw: cleaned });
  }
};
