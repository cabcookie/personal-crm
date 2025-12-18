import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "$amplify/env/process-export-tasks";

const s3Client = new S3Client({ region: env.AWS_REGION });

/**
 * Upload markdown export to S3 for recurring exports
 * Path structure: exports/{owner}/recurring/{recurringExportId}/latest.md
 */
export async function uploadToS3(
  markdown: string,
  owner: string,
  recurringExportId: string
): Promise<string> {
  const key = `exports/${owner}/recurring/${recurringExportId}/latest.md`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.STORAGE_BUCKET_NAME,
        Key: key,
        Body: markdown,
        ContentType: "text/markdown",
      })
    );

    console.log("Successfully uploaded to S3:", key);
    return key;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}
