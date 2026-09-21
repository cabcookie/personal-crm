import { getItemRaw } from "../process-export-tasks/helpers/dynamodb";
import { assembleProjectFromCache } from "../process-export-tasks/helpers/cached-assembly";
import { ClaudeSonnet45Us } from "../../data/models";
import { projectSummaryPrompt } from "../../data/prompts/project-summary";
import { converseText } from "./lib/bedrock";
import { updateItemAttributes } from "./lib/ddb-write";

/**
 * Project summary Lambda.
 *
 * Invoked by a one-time EventBridge schedule ~7 minutes after the last note
 * change on any of the project's activities (keyed by projectId, so multiple
 * activities coalesce into one run). It assembles the project's notes from the
 * CACHED per-activity building blocks (headers + notesMarkdown — no live block
 * rendering), and if there is content, asks Bedrock (Sonnet 4.5) for a
 * <=400-word prose summary written onto the Projects record.
 *
 * Payload: `{ projectId: string }`.
 */

type Event = { projectId?: string };

const isBlank = (s: string | null | undefined): boolean => !s || !s.trim();

export const handler = async (event: Event): Promise<void> => {
  const { projectId } = event;
  if (!projectId) {
    console.warn("[summary] no projectId in event; skipping");
    return;
  }

  const project = await getItemRaw<{ owner?: string }>("Projects", projectId);
  if (!project?.owner) {
    console.warn(`[summary] project ${projectId} missing/ownerless; skipping`);
    return;
  }
  const owner = project.owner;

  // Assemble newest-first from the cached activity headers + note snapshots.
  const notes = await assembleProjectFromCache(projectId, { owner }, 3);
  if (isBlank(notes)) {
    console.log(`[summary] project ${projectId} has no notes; skipping`);
    return;
  }

  const summary = await converseText({
    modelId: ClaudeSonnet45Us.resourcePath,
    systemPrompt: projectSummaryPrompt,
    content: [{ text: notes }],
    maxTokens: 1024,
  });

  await updateItemAttributes(
    "Projects",
    projectId,
    {
      projectSummary: summary,
      projectSummaryUpdatedAt: new Date().toISOString(),
    },
    owner
  );
  console.log(`[summary] wrote projectSummary for project ${projectId}`, {
    length: summary.length,
  });
};
