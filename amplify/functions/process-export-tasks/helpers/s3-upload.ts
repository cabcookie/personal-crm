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
        Body: markdown,
        ContentType: "text/markdown",
      })
    );

    console.log("Successfully uploaded to S3:", { bucket, key });
    return key;
  } catch (error) {
    console.error("Error uploading to S3:", { bucket, key, error });
    throw error;
  }
}
