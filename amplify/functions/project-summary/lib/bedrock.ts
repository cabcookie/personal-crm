import {
  BedrockRuntimeClient,
  ConverseCommand,
  type ContentBlock,
} from "@aws-sdk/client-bedrock-runtime";

/**
 * Thin wrapper around the Bedrock Converse API for the summary and
 * image-description Lambdas. Model ids come from `amplify/data/models.ts`
 * (US cross-region inference profiles), passed in by each caller.
 */

const client = new BedrockRuntimeClient({});

type ConverseArgs = {
  modelId: string;
  systemPrompt: string;
  content: ContentBlock[];
  maxTokens?: number;
  temperature?: number;
};

/**
 * Run a single-turn Converse request and return the concatenated text of the
 * assistant's reply. Throws when the model returns no text.
 */
export const converseText = async ({
  modelId,
  systemPrompt,
  content,
  maxTokens = 2048,
  temperature = 0.2,
}: ConverseArgs): Promise<string> => {
  const res = await client.send(
    new ConverseCommand({
      modelId,
      system: [{ text: systemPrompt }],
      messages: [{ role: "user", content }],
      inferenceConfig: { maxTokens, temperature },
    })
  );

  const text = (res.output?.message?.content ?? [])
    .map((block) => block.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(
      `Bedrock Converse returned no text (model=${modelId}, stopReason=${res.stopReason})`
    );
  }
  return text;
};

export type { ContentBlock };
