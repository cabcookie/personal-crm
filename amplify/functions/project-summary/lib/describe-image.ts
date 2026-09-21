import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { JSONContent } from "@tiptap/core";
import { ClaudeSonnet45Us } from "../../../data/models";
import { describeNoteImagePrompt } from "../../../data/prompts/describe-note-image";
import { converseText, type ContentBlock } from "./bedrock";
import { updateItemAttributes } from "./ddb-write";

/**
 * Shared image-description logic used by both the live stream handler
 * (image-handler.ts) and the one-off backfill worker. Reads an image from S3,
 * asks Bedrock (Sonnet 4.5, vision) to describe it, and writes the description
 * back onto the NoteBlock. Also clears the `imageDescriptionPending` backfill
 * marker so the block drops out of the sparse work-queue GSI.
 */

const s3 = new S3Client({});

const IMAGE_FORMATS: Record<string, "png" | "jpeg" | "gif" | "webp"> = {
  png: "png",
  jpg: "jpeg",
  jpeg: "jpeg",
  gif: "gif",
  webp: "webp",
};

export type NoteBlockImage = {
  id: string;
  owner?: string;
  type?: string;
  content?: JSONContent | string | null;
  imageDescription?: string | null;
};

const parseContent = (
  content: JSONContent | string | null | undefined
): JSONContent | null => {
  if (!content) return null;
  try {
    return typeof content === "string"
      ? (JSON.parse(content) as JSONContent)
      : content;
  } catch {
    return null;
  }
};

export const extractS3Key = (block: NoteBlockImage): string | null => {
  const node = parseContent(block.content);
  const attrs = node?.attrs;
  return (attrs?.s3Key as string) || (attrs?.fileKey as string) || null;
};

const formatFromKey = (key: string): "png" | "jpeg" | "gif" | "webp" => {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_FORMATS[ext] ?? "jpeg";
};

const streamToBytes = async (body: unknown): Promise<Uint8Array> => {
  const chunks: Buffer[] = [];
  for await (const chunk of body as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }
  return new Uint8Array(Buffer.concat(chunks));
};

export const getBucket = (): string => {
  const bucket = process.env.STORAGE_BUCKET_NAME;
  if (!bucket) throw new Error("Missing env STORAGE_BUCKET_NAME");
  return bucket;
};

/**
 * Describe one image and persist the result. `clearPending` also removes the
 * backfill marker (used by the backfill worker; the live handler passes
 * false). Returns the generated description, or null when the block has no
 * resolvable S3 key.
 */
export const describeAndPersist = async (
  block: NoteBlockImage,
  bucket: string,
  { clearPending = false }: { clearPending?: boolean } = {}
): Promise<string | null> => {
  const key = extractS3Key(block);
  if (!key) return null;

  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!obj.Body) throw new Error(`S3 object ${key} has no body`);
  const bytes = await streamToBytes(obj.Body);

  const content: ContentBlock[] = [
    { image: { format: formatFromKey(key), source: { bytes } } },
    { text: "Describe this image following your instructions." },
  ];

  const description = await converseText({
    modelId: ClaudeSonnet45Us.resourcePath,
    systemPrompt: describeNoteImagePrompt,
    content,
    maxTokens: 512,
  });

  await updateItemAttributes(
    "NoteBlock",
    block.id,
    {
      imageDescription: description,
      imageDescriptionUpdatedAt: new Date().toISOString(),
      // Clearing to undefined removes the attribute, dropping the block from
      // the sparse `imageDescriptionPending` GSI.
      ...(clearPending ? { imageDescriptionPending: undefined } : {}),
    },
    block.owner
  );

  return description;
};
