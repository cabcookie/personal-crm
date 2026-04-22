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
import { env } from "$amplify/env/manage-export-permissions";
import { client } from "./helpers/get-client";
import { getRecurringExport } from "../../graphql-code/queries";

const s3Client = new S3Client({ region: env.AWS_REGION });
// Recurring exports now live in their own dedicated bucket so grantees can be
// given bucket-wide access without exposing other user data. The bucket name
// is injected explicitly in custom/backend/export-tasks.ts — this Lambda
// never reads objects from the bucket, only manages its bucket policy.
const BUCKET_NAME = env.RECURRING_EXPORTS_BUCKET_NAME;

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
  Condition?: Record<string, Record<string, string | string[]>>;
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

const sidPrefixFor = (permissionId: string) =>
  `ExportPermission-${permissionId}`;

const matchesPermissionSid = (
  sid: string | undefined,
  permissionId: string
) => {
  const prefix = sidPrefixFor(permissionId);
  // Old format was exactly `ExportPermission-<permissionId>`; new format adds
  // a `-Get` / `-List` / `-Loc` suffix. Matching both keeps revoke correct for
  // policies written before this change.
  return sid === prefix || !!sid?.startsWith(`${prefix}-`);
};

// Extract the identityId and recurringExportId from an S3 key shaped as
// `exports/<identityId>/<recurringExportId>/<fileName>` (the dedicated
// recurring-exports bucket layout).
const parseExportKey = (s3Key: string) => {
  const parts = s3Key.split("/");
  if (parts.length < 4 || parts[0] !== "exports") {
    throw new Error(`Unexpected s3Key shape for recurring export: ${s3Key}`);
  }
  return { identityId: parts[1], recurringExportId: parts[2] };
};

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
    // Permission will be applied when the first export runs and fills s3Key.
    return;
  }

  const { identityId, recurringExportId: rid } = parseExportKey(s3Key);
  const sidPrefix = sidPrefixFor(permissionId);
  const bucketArn = `arn:aws:s3:::${BUCKET_NAME}`;

  const newStatements: PolicyStatement[] = [
    {
      // Read the exact export object. GetObjectVersion added alongside so
      // versioned reads (QuickSight/Quick Suite uses them during refresh,
      // even though our bucket isn't versioned) don't 403 later.
      Sid: `${sidPrefix}-Get`,
      Effect: "Allow",
      Principal: { AWS: grantedTo },
      Action: ["s3:GetObject", "s3:GetObjectVersion"],
      Resource: `${bucketArn}/${s3Key}`,
    },
    {
      // List ONLY the contents of this one recurring export's folder.
      //
      // We used to allow each step of the path (root, `exports/`, etc.) so a
      // grantee pointed at the bucket root could traverse down — but in
      // practice Quick Suite issues `ListObjects` with no prefix at all,
      // which returned every key in the bucket (cross-tenant metadata leak)
      // and caused it to HeadObject siblings it shouldn't have seen.
      //
      // StringLikeIfExists keeps HeadBucket working: HeadBucket reuses the
      // `s3:ListBucket` IAM action but sends no `s3:prefix` request context,
      // so the condition short-circuits to allow. When a prefix IS sent
      // (i.e. real listing calls) it must match this folder's pattern.
      //
      // Consequence: grantees must point their tool at the folder URL
      // `s3://<bucket>/exports/<identityId>/recurring/<rid>/`, not the
      // bucket root.
      Sid: `${sidPrefix}-List`,
      Effect: "Allow",
      Principal: { AWS: grantedTo },
      Action: ["s3:ListBucket", "s3:ListBucketVersions"],
      Resource: bucketArn,
      Condition: {
        StringLikeIfExists: {
          "s3:prefix": [`exports/${identityId}/${rid}/*`],
        },
      },
    },
    {
      // Region lookup — QuickSight calls this on data-source creation.
      Sid: `${sidPrefix}-Loc`,
      Effect: "Allow",
      Principal: { AWS: grantedTo },
      Action: "s3:GetBucketLocation",
      Resource: bucketArn,
    },
  ];

  const policy = await getBucketPolicy();
  policy.Statement = policy.Statement.filter(
    (stmt) => !matchesPermissionSid(stmt.Sid, permissionId)
  );
  policy.Statement.push(...newStatements);

  await putBucketPolicy(policy);

  console.log("S3 access granted successfully", {
    permissionId,
    s3Key,
    statementCount: newStatements.length,
  });
}

async function revokeS3Access(permissionId: string): Promise<void> {
  console.log("Revoking S3 access", { permissionId });

  const policy = await getBucketPolicy();

  const originalCount = policy.Statement.length;
  policy.Statement = policy.Statement.filter(
    (stmt) => !matchesPermissionSid(stmt.Sid, permissionId)
  );
  const removed = originalCount - policy.Statement.length;

  if (removed === 0) {
    console.warn("No statements found to revoke", { permissionId });
    return;
  }

  await putBucketPolicy(policy);

  console.log("S3 access revoked successfully", { permissionId, removed });
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
