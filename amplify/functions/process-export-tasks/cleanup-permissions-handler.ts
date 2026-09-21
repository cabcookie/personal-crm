/**
 * DynamoDB Stream-triggered Lambda on the RecurringExport table.
 *
 * When a RecurringExport is removed, every ExportPermission that grants access
 * to it is now orphaned: the export it points at no longer exists, but the
 * grant still keeps a cross-account principal in the bucket policy. This
 * handler deletes those ExportPermission records. Each delete in turn emits a
 * REMOVE stream event on the ExportPermission table, which the existing
 * manageExportPermissions Lambda consumes to strip the matching statements
 * from the bucket policy — so the policy converges to "no orphaned grants"
 * without this handler ever touching S3 itself.
 */

import { DynamoDBStreamHandler, DynamoDBRecord } from "aws-lambda";
import { client } from "./helpers/get-cleanup-client";
import { listExportPermissionByRecurringExportId } from "../../graphql-code/queries";
import { deleteExportPermission } from "../../graphql-code/mutations";

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log("Processing RecurringExport DynamoDB Stream event", {
    recordCount: event.Records.length,
  });

  for (const record of event.Records) {
    try {
      await processRecord(record);
    } catch (error) {
      console.error("Error processing RecurringExport record", {
        eventName: record.eventName,
        error,
      });
      // Continue with other records; a single failure must not block cleanup
      // of the rest of the batch.
    }
  }
};

async function processRecord(record: DynamoDBRecord): Promise<void> {
  if (record.eventName !== "REMOVE") return;

  const oldImage = record.dynamodb?.OldImage;
  const recurringExportId = oldImage?.id?.S;

  if (!recurringExportId) {
    console.warn("REMOVE event without a resolvable RecurringExport id");
    return;
  }

  await deletePermissionsFor(recurringExportId);
}

async function deletePermissionsFor(recurringExportId: string): Promise<void> {
  console.log("Cleaning up ExportPermissions for deleted RecurringExport", {
    recurringExportId,
  });

  let nextToken: string | null | undefined = undefined;
  let deleted = 0;

  do {
    const { data, errors }: any = await client.graphql({
      query: listExportPermissionByRecurringExportId,
      variables: { recurringExportId, limit: 100, nextToken },
    });

    if (errors) {
      console.error("Failed listing ExportPermissions to clean up", {
        recurringExportId,
        errors,
      });
      throw new Error(
        `Could not list ExportPermissions for ${recurringExportId}`
      );
    }

    const connection = data?.listExportPermissionByRecurringExportId;
    const items: Array<{ id: string }> = connection?.items ?? [];
    nextToken = connection?.nextToken;

    for (const item of items) {
      const { errors: deleteErrors } = await client.graphql({
        query: deleteExportPermission,
        variables: { input: { id: item.id } },
      });

      if (deleteErrors) {
        // Log and continue: leaving one behind is safer than aborting the
        // whole cleanup, and the record can be retried on a later run.
        console.error("Failed deleting ExportPermission", {
          permissionId: item.id,
          recurringExportId,
          errors: deleteErrors,
        });
        continue;
      }
      deleted += 1;
    }
  } while (nextToken);

  console.log("ExportPermission cleanup complete", {
    recurringExportId,
    deleted,
  });
}
