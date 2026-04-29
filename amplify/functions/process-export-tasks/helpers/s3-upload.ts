import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "$amplify/env/process-export-tasks";

const s3Client = new S3Client({ region: env.AWS_REGION });

type UploadArgs = {
  markdown: string;
  bucket: string;
  key: string;
};

export async function uploadToS3({
  markdown,
  bucket,
  key,
}: UploadArgs): Promise<string> {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        // BOM + charset both signal UTF-8: Quick Suite (and other Microsoft
        // tools) ignore the Content-Type header and fall back to Windows-1252
        // when the file lacks a BOM, which mojibakes umlauts and smart quotes.
        Body: `\uFEFF${markdown}`,
        ContentType: "text/markdown; charset=utf-8",
      })
    );

    console.log("Successfully uploaded to S3:", { bucket, key });
    return key;
  } catch (error) {
    console.error("Error uploading to S3:", { bucket, key, error });
    throw error;
  }
}
