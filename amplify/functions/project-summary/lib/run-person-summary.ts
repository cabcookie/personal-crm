import { ClaudeSonnetUs } from "../../../data/models";
import { personSummaryPrompt } from "../../../data/prompts/person-summary";
import { converseText } from "./bedrock";
import { updateItemAttributes } from "./ddb-write";
import {
  hashContext,
  hasActivity,
  loadPersonContext,
  renderPersonContext,
} from "./person-context";

/**
 * Shared core of the person-summary Lambda and its backfill worker.
 *
 * Loads the person's context, skips when there is no activity (no learnings,
 * meetings or mentions) or when the rendered context is unchanged since the
 * last run (hash in `personSummarySource`), otherwise asks Sonnet for the
 * five-paragraph summary and writes it back via raw DynamoDB (owner-
 * preserving). With `clearPending` it also removes the sparse backfill marker.
 */

type Options = { clearPending?: boolean };

export const runPersonSummary = async (
  personId: string,
  { clearPending = false }: Options = {}
): Promise<void> => {
  const loaded = await loadPersonContext(personId);
  if (!loaded) {
    console.warn(
      `[person-summary] person ${personId} missing/ownerless/nameless; skipping`
    );
    return;
  }
  const { owner, context, personSummarySource } = loaded;
  const clear = clearPending ? { personSummaryPending: undefined } : {};

  if (!hasActivity(context)) {
    console.log(
      `[person-summary] person ${personId} has no activity; skipping`
    );
    if (clearPending) {
      await updateItemAttributes("Person", personId, clear, owner);
    }
    return;
  }

  const markdown = renderPersonContext(context);
  const source = hashContext(markdown);
  if (source === personSummarySource) {
    console.log(`[person-summary] person ${personId} unchanged; skipping`);
    if (clearPending) {
      await updateItemAttributes("Person", personId, clear, owner);
    }
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const summary = await converseText({
    modelId: ClaudeSonnetUs.resourcePath,
    systemPrompt: personSummaryPrompt,
    content: [{ text: `Today: ${today}\n\n${markdown}` }],
    maxTokens: 1024,
  });

  await updateItemAttributes(
    "Person",
    personId,
    {
      personSummary: summary,
      personSummarySource: source,
      personSummaryUpdatedAt: new Date().toISOString(),
      ...clear,
    },
    owner
  );
  console.log(`[person-summary] wrote summary for person ${personId}`, {
    inputChars: markdown.length,
    length: summary.length,
  });
};
