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
 * `suggest_project` backing resolver.
 *
 * Embeds the query text (Titan v2) and runs a DynamoDB vector search against
 * the Projects summary-embedding index, scoped to the caller's own owner. The
 * owner is reconstructed from the Cognito identity in the resolver event —
 * NEVER from client arguments — so a caller can only ever match their own
 * projects (DynamoDB SearchVectors ignores FGAC, so this Lambda is the tenant
 * boundary). Returns the top matches with a similarity score.
 */

const TITAN_EMBED_MODEL_ID = "amazon.titan-embed-text-v2:0";
const EMBEDDING_DIMENSIONS = 1024;
const DEFAULT_TOP_K = 3;

const ddb = new DynamoDBClient({});
const bedrock = new BedrockRuntimeClient({});

const TABLE_NAME = process.env.DDB_TABLE_PROJECTS!;
const INDEX_NAME = process.env.PROJECT_VECTOR_INDEX_NAME!;

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
  projectId: string;
  name: string;
  summarySnippet: string | null;
  score: number;
};

/** Reconstruct the `sub::username` owner the data tables store. */
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
    throw new Error("Unauthenticated: cannot resolve owner for vector search");
  }

  const vector = await embed(query);
  const searchVector: AttributeValue[] = vector.map((n) => ({
    N: n.toString(),
  }));

  // The index has no owner key in its search schema, so we over-fetch and
  // post-filter by the caller's own owner here — the Lambda is the trust
  // boundary. OVERFETCH gives headroom so foreign hits don't crowd out matches.
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
      project?: string;
      owner?: string;
      summaryEmbeddingSource?: string | null;
    };
    if (item.owner !== owner) continue; // tenant boundary
    if (!item.id || !item.project) continue;
    matches.push({
      projectId: item.id,
      name: item.project,
      // The embedding source is "<name> — <first summary section>"; expose the
      // section as a snippet for display/debug.
      summarySnippet: item.summaryEmbeddingSource ?? null,
      score: r.Score ?? 0,
    });
    if (matches.length >= topK) break;
  }
  return matches;
};
