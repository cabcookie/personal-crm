/**
 * DynamoDB Stream-triggered Lambda that manages S3 bucket policies
 * for cross-account/IAM role access to recurring exports.
 */

import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import {
  S3Client,
  GetBucketPolicyCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { client } from "./helpers/get-client";
import { getRecurringExport } from "../../graphql-code/queries";

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME!;

interface BucketPolicy {
  Version: string;
  Statement: PolicyStatement[];
}

interface PolicyStatement {
  Sid: string;
  Effect: string;
  Principal: { AWS?: string | string[] };
  Action: string | string[];
  Resource: string | string[];
}

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log("Processing ExportPermission DynamoDB Stream event", {
    recordCount: event.Records.length,
  });

  for (const record of event.Records) {
    try {
      await processPermissionRecord(record);
    } catch (error) {
      console.error("Error processing permission record", {
        eventName: record.eventName,
        error,
      });
      // Continue processing other records
    }
  }
};

async function processPermissionRecord(record: DynamoDBRecord): Promise<void> {
  const eventName = record.eventName;

  if (eventName === "INSERT" || eventName === "MODIFY") {
    const newImage = record.dynamodb?.NewImage;
    if (!newImage) {
      console.warn("No NewImage in INSERT/MODIFY event");
      return;
    }

    const permissionId = newImage.id?.S;
    const recurringExportId = newImage.recurringExportId?.S;
    const grantedTo = newImage.grantedTo?.S;

    if (!permissionId || !recurringExportId || !grantedTo) {
      console.warn("Missing required fields in permission record", {
        permissionId,
        recurringExportId,
        grantedTo,
      });
      return;
    }

    await grantS3Access(permissionId, recurringExportId, grantedTo);
  } else if (eventName === "REMOVE") {
    const oldImage = record.dynamodb?.OldImage;
    if (!oldImage) {
      console.warn("No OldImage in REMOVE event");
      return;
    }

    const permissionId = oldImage.id?.S;

    if (!permissionId) {
      console.warn("Missing permission ID in REMOVE event");
      return;
    }

    await revokeS3Access(permissionId);
  }
}

async function grantS3Access(
  permissionId: string,
  recurringExportId: string,
  grantedTo: string
): Promise<void> {
  console.log("Granting S3 access", {
    permissionId,
    recurringExportId,
    grantedTo,
  });

  // Get the s3Key from RecurringExport
  const { data, errors } = await client.graphql({
    query: getRecurringExport,
    variables: { id: recurringExportId },
  });

  if (errors || !data?.getRecurringExport) {
    console.error("Failed to get RecurringExport", {
      recurringExportId,
      errors,
    });
    throw new Error(`RecurringExport ${recurringExportId} not found`);
  }

  const s3Key = data.getRecurringExport.s3Key;
  if (!s3Key) {
    console.warn("RecurringExport has no s3Key yet", { recurringExportId });
    // This is OK - permission will be applied when the first export runs
    return;
  }

  // Get current bucket policy
  const policy = await getBucketPolicy();

  // Create new policy statement
  const statementId = `ExportPermission-${permissionId}`;
  const newStatement: PolicyStatement = {
    Sid: statementId,
    Effect: "Allow",
    Principal: { AWS: grantedTo },
    Action: "s3:GetObject",
    Resource: `arn:aws:s3:::${BUCKET_NAME}/${s3Key}`,
  };

  // Remove existing statement with same Sid (in case of update)
  policy.Statement = policy.Statement.filter(
    (stmt) => stmt.Sid !== statementId
  );

  // Add new statement
  policy.Statement.push(newStatement);

  // Update bucket policy
  await putBucketPolicy(policy);

  console.log("S3 access granted successfully", { permissionId, s3Key });
}

async function revokeS3Access(permissionId: string): Promise<void> {
  console.log("Revoking S3 access", { permissionId });

  // Get current bucket policy
  const policy = await getBucketPolicy();

  // Remove statement with matching Sid
  const statementId = `ExportPermission-${permissionId}`;
  const originalCount = policy.Statement.length;
  policy.Statement = policy.Statement.filter(
    (stmt) => stmt.Sid !== statementId
  );

  if (policy.Statement.length === originalCount) {
    console.warn("No statement found to revoke", { permissionId, statementId });
    return;
  }

  // Update bucket policy
  await putBucketPolicy(policy);

  console.log("S3 access revoked successfully", { permissionId });
}

async function getBucketPolicy(): Promise<BucketPolicy> {
  try {
    const command = new GetBucketPolicyCommand({ Bucket: BUCKET_NAME });
    const response = await s3Client.send(command);

    if (!response.Policy) {
      // No policy exists, create a default one
      return {
        Version: "2012-10-17",
        Statement: [],
      };
    }

    return JSON.parse(response.Policy);
  } catch (error: any) {
    if (error.name === "NoSuchBucketPolicy") {
      // No policy exists, create a default one
      return {
        Version: "2012-10-17",
        Statement: [],
      };
    }
    throw error;
  }
}

async function putBucketPolicy(policy: BucketPolicy): Promise<void> {
  const command = new PutBucketPolicyCommand({
    Bucket: BUCKET_NAME,
    Policy: JSON.stringify(policy),
  });

  await s3Client.send(command);
}
