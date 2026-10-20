import {
  DynamoDBClient,
  SearchVectorsCommand,
  BatchGetItemCommand,
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
const BATCH_GET_CHUNK_SIZE = 100;

const ddb = new DynamoDBClient({});
const bedrock = new BedrockRuntimeClient({});

const TABLE_NAME = process.env.DDB_TABLE_PROJECTS!;
const ACCOUNT_TABLE_NAME = process.env.DDB_TABLE_ACCOUNT!;
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
  company: string | null;
  score: number;
};

/** Reconstruct the `sub::username` owner the data tables store. */
const ownerFromIdentity = (identity?: AppSyncIdentity): string | null => {
  const sub = identity?.sub ?? identity?.claims?.sub;
  const username = identity?.username ?? identity?.claims?.["cognito:username"];
  if (!sub || !username) return null;
  return `${sub}::${username}`;
};

/** Plain BatchGetItem by id, chunked at 100 keys. No owner filter here — the
 * caller applies its own tenant check against the returned items. */
const batchGetById = async <T extends { id?: string }>(
  tableName: string,
  ids: string[]
): Promise<Map<string, T>> => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, T>();
  if (!uniqueIds.length) return map;
  for (let i = 0; i < uniqueIds.length; i += BATCH_GET_CHUNK_SIZE) {
    const chunk = uniqueIds.slice(i, i + BATCH_GET_CHUNK_SIZE);
    let keys: Record<string, AttributeValue>[] = chunk.map((id) => ({
      id: { S: id },
    }));
    while (keys.length) {
      const res = await ddb.send(
        new BatchGetItemCommand({
          RequestItems: { [tableName]: { Keys: keys } },
        })
      );
      for (const item of res.Responses?.[tableName] ?? []) {
        const obj = unmarshall(item) as T;
        if (obj.id) map.set(obj.id, obj);
      }
      keys = res.UnprocessedKeys?.[tableName]?.Keys ?? [];
    }
  }
  return map;
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
  // boundary. Over-fetch further to leave headroom after the `done` filter
  // below (closed/done projects should never be suggested mid-meeting).
  const OVERFETCH = Math.max(topK * 10, 40);

  const res = await ddb.send(
    new SearchVectorsCommand({
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      SearchVector: searchVector,
      TopK: OVERFETCH,
    })
  );

  type Candidate = {
    projectId: string;
    name: string;
    summarySnippet: string | null;
    score: number;
  };
  const candidates: Candidate[] = [];
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
    candidates.push({
      projectId: item.id,
      name: item.project,
      // The embedding source is "<name> — <first summary section>"; expose the
      // section as a snippet for display/debug.
      summarySnippet: item.summaryEmbeddingSource ?? null,
      score: r.Score ?? 0,
    });
  }
  if (!candidates.length) return [];

  // The vector index doesn't project `done`/`partnerId` — fetch the full
  // records for the candidates to filter out done projects and resolve the
  // customer/account name for display.
  const projectIds = candidates.map((c) => c.projectId);
  const projectMap = await batchGetById<{
    id: string;
    done?: boolean;
    partnerId?: string | null;
    owner?: string;
  }>(TABLE_NAME, projectIds);

  const openCandidates = candidates.filter((c) => {
    const p = projectMap.get(c.projectId);
    // A candidate missing from the batch-get (shouldn't happen) is dropped
    // rather than risking surfacing a stale/removed project.
    return !!p && p.owner === owner && p.done !== true;
  });

  const partnerIds = [
    ...new Set(
      openCandidates
        .map((c) => projectMap.get(c.projectId)?.partnerId)
        .filter((id): id is string => !!id)
    ),
  ];
  const accountMap = partnerIds.length
    ? await batchGetById<{ id: string; name?: string }>(
        ACCOUNT_TABLE_NAME,
        partnerIds
      )
    : new Map<string, { id: string; name?: string }>();

  const matches: Match[] = openCandidates.slice(0, topK).map((c) => {
    const partnerId = projectMap.get(c.projectId)?.partnerId ?? null;
    return {
      ...c,
      company: partnerId ? (accountMap.get(partnerId)?.name ?? null) : null,
    };
  });
  return matches;
};
