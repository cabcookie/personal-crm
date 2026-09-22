import {
  DynamoDBClient,
  SearchVectorsCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

/**
 * `report_detected_person` backing resolver.
 *
 * Embeds the spoken name (Titan v2) and runs a DynamoDB vector search against
 * the Person name-embedding index, scoped to the caller's own owner. The owner
 * is reconstructed from the Cognito identity in the resolver event — NEVER
 * from client arguments — so a caller can only ever match their own people
 * (DynamoDB SearchVectors ignores FGAC, so this Lambda is the tenant boundary).
 *
 * Returns the top matches with a similarity score, letting the client (and
 * Sonic) decide "known person" vs "new person".
 */

const TITAN_EMBED_MODEL_ID = "amazon.titan-embed-text-v2:0";
const EMBEDDING_DIMENSIONS = 1024;
const DEFAULT_TOP_K = 3;

const ddb = new DynamoDBClient({});
const bedrock = new BedrockRuntimeClient({});

const TABLE_NAME = process.env.DDB_TABLE_PERSON!;
const INDEX_NAME = process.env.PERSON_VECTOR_INDEX_NAME!;

type AppSyncIdentity = {
  sub?: string;
  username?: string;
  claims?: { sub?: string; "cognito:username"?: string };
};

type Event = {
  arguments?: { query?: string; topK?: number };
  identity?: AppSyncIdentity;
};

type Match = {
  personId: string;
  name: string;
  source: string | null;
  company: string | null;
  role: string | null;
  score: number;
};

/**
 * The embedding source is built by renderParticipant as one of:
 *   "Name"                       (no employment)
 *   "Name (Company)"             (company only)
 *   "Name (Company, Role)"       (company + role)
 * Recover structured company/role from that trailing parenthetical so the UI
 * can show them separately. We split the parenthetical on the FIRST comma:
 * everything before is the company, the remainder is the role (roles can
 * contain commas, companies here don't).
 */
const parseEmployment = (
  name: string,
  source: string | null
): { company: string | null; role: string | null } => {
  if (!source) return { company: null, role: null };
  const m = source.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (!m || m[1].trim() !== name.trim()) return { company: null, role: null };
  const inner = m[2];
  const comma = inner.indexOf(",");
  if (comma === -1) return { company: inner.trim(), role: null };
  return {
    company: inner.slice(0, comma).trim() || null,
    role: inner.slice(comma + 1).trim() || null,
  };
};

/**
 * Reconstruct the `sub::username` owner the data tables store. userPool-mode
 * resolvers expose sub + username directly (and also under claims).
 */
const ownerFromIdentity = (identity?: AppSyncIdentity): string | null => {
  const sub = identity?.sub ?? identity?.claims?.sub;
  const username = identity?.username ?? identity?.claims?.["cognito:username"];
  if (!sub || !username) return null;
  return `${sub}::${username}`;
};

const embed = async (text: string): Promise<number[]> => {
  const res = await bedrock.send(
    new InvokeModelCommand({
      modelId: TITAN_EMBED_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: text,
        dimensions: EMBEDDING_DIMENSIONS,
        normalize: true,
      }),
    })
  );
  const parsed = JSON.parse(new TextDecoder().decode(res.body)) as {
    embedding?: number[];
  };
  if (!parsed.embedding || parsed.embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error("Titan embedding returned unexpected dimensions");
  }
  return parsed.embedding;
};

export const handler = async (event: Event): Promise<Match[]> => {
  const query = (event.arguments?.query ?? "").trim();
  const topK = event.arguments?.topK ?? DEFAULT_TOP_K;
  if (!query) return [];

  const owner = ownerFromIdentity(event.identity);
  if (!owner) {
    // No verifiable tenant → refuse rather than search across tenants.
    throw new Error("Unauthenticated: cannot resolve owner for vector search");
  }

  const vector = await embed(query);
  const searchVector: AttributeValue[] = vector.map((n) => ({
    N: n.toString(),
  }));

  // The index has no owner key in its search schema (that would require owner
  // to be a declared table attribute), so we cannot filter tenants inside
  // SearchVectors. Instead we over-fetch and post-filter by the caller's own
  // owner here — the Lambda is the trust boundary. OVERFETCH gives headroom so
  // a few foreign hits don't crowd out the caller's matches.
  const OVERFETCH = Math.max(topK * 5, 20);

  const res = await ddb.send(
    new SearchVectorsCommand({
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      SearchVector: searchVector,
      TopK: OVERFETCH,
    })
  );

  const matches: Match[] = [];
  for (const r of res.SearchResults ?? []) {
    if (!r.Item) continue;
    const item = unmarshall(r.Item) as {
      id?: string;
      name?: string;
      owner?: string;
      nameEmbeddingSource?: string | null;
    };
    if (item.owner !== owner) continue; // tenant boundary
    if (!item.id || !item.name) continue;
    const source = item.nameEmbeddingSource ?? null;
    const { company, role } = parseEmployment(item.name, source);
    matches.push({
      personId: item.id,
      name: item.name,
      source,
      company,
      role,
      score: r.Score ?? 0,
    });
    if (matches.length >= topK) break;
  }
  return matches;
};
