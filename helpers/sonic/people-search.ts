import { client } from "@/lib/amplify";
import type { PersonMatch } from "./client";

/**
 * Person search used when resolving a detected mention by hand: what the user
 * types is the primary signal, the words Sonic heard ("CEO meinaldi.de") are
 * secondary context.
 *
 * The person index is purely semantic (embeddings of "Name (Company, Role)"),
 * so we run two searches in parallel — the typed text alone, and typed text +
 * heard words — and rank by a weighted blend of both COSINE distances. Typing
 * "Mark" then keeps every Mark near the top (typed signal), while the Mark
 * whose role matches what was heard ranks first (context signal). Someone who
 * only matches the heard words but isn't called Mark falls behind.
 */

const TOP_K = 8;
/** Weight of the typed-only distance; the rest goes to typed + heard. */
const TYPED_WEIGHT = 0.65;
/** Distance assumed for a person missing from one of the two result lists. */
const MISSING_DISTANCE = 1;

const runSearch = async (query: string): Promise<PersonMatch[]> => {
  const { data, errors } = await client.queries.searchPeople({
    query,
    topK: TOP_K,
  });
  if (errors) {
    console.error("searchPeople", errors);
    return [];
  }
  return (data ?? []).flatMap((m): PersonMatch[] =>
    m && m.personId && m.name
      ? [
          {
            personId: m.personId,
            name: m.name,
            source: m.source ?? null,
            company: m.company ?? null,
            role: m.role ?? null,
            score: m.score ?? MISSING_DISTANCE,
          },
        ]
      : []
  );
};

export const searchPeopleWithContext = async (
  typed: string,
  heardTerms: string[]
): Promise<PersonMatch[]> => {
  const q = typed.trim();
  if (!q) return [];
  const context = heardTerms
    .map((t) => t.trim())
    // Skip heard words the user already typed.
    .filter((t) => t && !t.toLowerCase().includes(q.toLowerCase()))
    .join(" ");
  if (!context) return runSearch(q);

  const [typedOnly, withContext] = await Promise.all([
    runSearch(q),
    runSearch(`${q} ${context}`),
  ]);
  const byId = new Map<string, PersonMatch>();
  for (const m of [...typedOnly, ...withContext]) {
    if (!byId.has(m.personId)) byId.set(m.personId, m);
  }
  const distance = (list: PersonMatch[], id: string) =>
    list.find((m) => m.personId === id)?.score ?? MISSING_DISTANCE;
  return [...byId.values()]
    .map((m) => ({
      ...m,
      score:
        TYPED_WEIGHT * distance(typedOnly, m.personId) +
        (1 - TYPED_WEIGHT) * distance(withContext, m.personId),
    }))
    .sort((a, b) => a.score - b.score);
};
