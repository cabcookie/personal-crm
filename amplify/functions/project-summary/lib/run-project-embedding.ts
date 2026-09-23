import { getItemRaw } from "../../process-export-tasks/helpers/dynamodb";
import { embedText } from "./embeddings";
import { updateItemAttributes } from "./ddb-write";

/**
 * Shared core for producing a Project's summary embedding, used by BOTH the
 * online debounced handler (project-embedding-handler.ts) and the one-off
 * backfill worker (backfill-project-embedding-worker-handler.ts).
 *
 * Builds the embedding source as "<project name> — <first summary section>":
 * the project name plus the first paragraph of the AI project summary (up to
 * the first blank line), which carries the gist without the full prose. Embeds
 * it with Titan Text Embeddings v2 and writes the 1024-dim vector directly onto
 * the Projects record as a native DynamoDB List<Number>. Skips the Bedrock call
 * when the source string is unchanged since the last run.
 *
 * When `clearPending` is set, the sparse `summaryEmbeddingPending` backfill
 * marker is removed on the same write (also on the unchanged-source skip), so a
 * backfilled project always leaves the work queue.
 */

type ProjectRow = {
  owner?: string;
  project?: string;
  projectSummary?: string | null;
  summaryEmbeddingSource?: string | null;
};

type Options = { clearPending?: boolean };

/** First section of the summary: everything up to the first blank line. */
export const firstSummarySection = (summary?: string | null): string => {
  if (!summary) return "";
  const trimmed = summary.trim();
  if (!trimmed) return "";
  const idx = trimmed.indexOf("\n\n");
  return (idx === -1 ? trimmed : trimmed.slice(0, idx)).trim();
};

/** Build the embedding source text from a project's name + first section. */
export const buildProjectEmbeddingSource = (
  name: string,
  summary?: string | null
): string => {
  const section = firstSummarySection(summary);
  return section ? `${name} — ${section}` : name;
};

export const runProjectEmbedding = async (
  projectId: string,
  { clearPending = false }: Options = {}
): Promise<void> => {
  const project = await getItemRaw<ProjectRow>("Projects", projectId);
  if (!project?.owner) {
    console.warn(
      `[project-embedding] project ${projectId} missing/ownerless; skipping`
    );
    return;
  }
  const owner = project.owner;
  const name = (project.project ?? "").trim();
  if (!name) {
    console.warn(
      `[project-embedding] project ${projectId} has no name; skipping`
    );
    if (clearPending) {
      await updateItemAttributes(
        "Projects",
        projectId,
        { summaryEmbeddingPending: undefined },
        owner
      );
    }
    return;
  }

  const source = buildProjectEmbeddingSource(name, project.projectSummary);

  // Skip the Bedrock call when nothing semantic changed.
  if (source === (project.summaryEmbeddingSource ?? "").trim()) {
    console.log(
      `[project-embedding] project ${projectId} source unchanged; skipping embed`
    );
    if (clearPending) {
      await updateItemAttributes(
        "Projects",
        projectId,
        { summaryEmbeddingPending: undefined },
        owner
      );
    }
    return;
  }

  const embedding = await embedText(source);

  await updateItemAttributes(
    "Projects",
    projectId,
    {
      summaryEmbedding: embedding,
      summaryEmbeddingSource: source,
      summaryEmbeddingUpdatedAt: new Date().toISOString(),
      ...(clearPending ? { summaryEmbeddingPending: undefined } : {}),
    },
    owner
  );
  console.log(`[project-embedding] wrote embedding for project ${projectId}`, {
    source,
    dims: embedding.length,
  });
};
