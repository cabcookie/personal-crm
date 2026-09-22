import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

/**
 * Amazon Titan Text Embeddings v2 wrapper for the person-embedding pipeline.
 *
 * Produces a dense float vector for a piece of text (here: "Name (Company,
 * Role)") which is stored on the Person record and searched via DynamoDB's
 * native vector index. The dimension count MUST match the vector index created
 * in custom/backend/person-embedding.ts (1024).
 *
 * Model id is the plain on-demand foundation model in us-east-1 — Titan
 * embeddings do not need a cross-region inference profile like the Sonnet
 * summary path does.
 */

export const TITAN_EMBED_MODEL_ID = "amazon.titan-embed-text-v2:0";
export const EMBEDDING_DIMENSIONS = 1024;

const client = new BedrockRuntimeClient({});

type TitanEmbedResponse = {
  embedding?: number[];
  inputTextTokenCount?: number;
};

/**
 * Generate a normalized 1024-dim embedding for `text`. Returns the raw float
 * array; the caller is responsible for writing it to DynamoDB as a native
 * List<Number> (see writeVectorAttribute in ddb-write).
 */
export const embedText = async (text: string): Promise<number[]> => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("embedText: refusing to embed empty text");
  }

  const res = await client.send(
    new InvokeModelCommand({
      modelId: TITAN_EMBED_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: trimmed,
        dimensions: EMBEDDING_DIMENSIONS,
        normalize: true,
      }),
    })
  );

  const parsed = JSON.parse(
    new TextDecoder().decode(res.body)
  ) as TitanEmbedResponse;

  if (!parsed.embedding || parsed.embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Titan embedding returned ${parsed.embedding?.length ?? 0} dims, expected ${EMBEDDING_DIMENSIONS}`
    );
  }
  return parsed.embedding;
};
