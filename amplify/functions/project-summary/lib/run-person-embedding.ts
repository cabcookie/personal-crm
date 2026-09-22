import { getItemRaw } from "../../process-export-tasks/helpers/dynamodb";
import {
  fetchCurrentEmployment,
  renderParticipant,
} from "../../process-export-tasks/helpers/activities";
import { embedText } from "./embeddings";
import { updateItemAttributes } from "./ddb-write";

/**
 * Shared core for producing a Person's name embedding, used by BOTH the
 * online debounced handler (person-embedding-handler.ts) and the one-off
 * backfill worker (backfill-person-embedding-worker-handler.ts).
 *
 * Builds "Name (Company, Role)" (same shape as the meeting header), embeds it
 * with Titan Text Embeddings v2, and writes the 1024-dim vector directly onto
 * the Person record as a native DynamoDB List<Number>. Skips the Bedrock call
 * when the source string is unchanged since the last run.
 *
 * When `clearPending` is set, the sparse `nameEmbeddingPending` backfill marker
 * is removed on the same write (also on the unchanged-source skip), so a
 * backfilled person always leaves the work queue.
 */

type PersonRow = {
  owner?: string;
  name?: string;
  nameEmbeddingSource?: string | null;
};

type Options = { clearPending?: boolean };

export const runPersonEmbedding = async (
  personId: string,
  { clearPending = false }: Options = {}
): Promise<void> => {
  const person = await getItemRaw<PersonRow>("Person", personId);
  if (!person?.owner) {
    console.warn(
      `[person-embedding] person ${personId} missing/ownerless; skipping`
    );
    return;
  }
  const owner = person.owner;
  const name = (person.name ?? "").trim();
  if (!name) {
    console.warn(`[person-embedding] person ${personId} has no name; skipping`);
    // Still clear the marker so a nameless person doesn't linger in the queue.
    if (clearPending) {
      await updateItemAttributes(
        "Person",
        personId,
        { nameEmbeddingPending: undefined },
        owner
      );
    }
    return;
  }

  // Resolve current company + role the same way the meeting header does.
  const employment = await fetchCurrentEmployment(personId, { owner });
  const source = renderParticipant(name, employment);

  // Skip the Bedrock call when nothing semantic changed.
  if (source === (person.nameEmbeddingSource ?? "").trim()) {
    console.log(
      `[person-embedding] person ${personId} source unchanged; skipping embed`
    );
    if (clearPending) {
      await updateItemAttributes(
        "Person",
        personId,
        { nameEmbeddingPending: undefined },
        owner
      );
    }
    return;
  }

  const embedding = await embedText(source);

  await updateItemAttributes(
    "Person",
    personId,
    {
      nameEmbedding: embedding,
      nameEmbeddingSource: source,
      nameEmbeddingUpdatedAt: new Date().toISOString(),
      ...(clearPending ? { nameEmbeddingPending: undefined } : {}),
    },
    owner
  );
  console.log(`[person-embedding] wrote embedding for person ${personId}`, {
    source,
    dims: embedding.length,
  });
};
