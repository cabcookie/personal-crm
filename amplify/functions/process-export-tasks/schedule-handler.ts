/**
 * EventBridge-triggered Lambda that runs every 15 minutes
 * to check for due recurring exports and create ExportTask records.
 */

import type { Handler } from "aws-lambda";
import { calculateNextRun } from "./helpers/calculate-next-run";
import { subDays } from "date-fns";
import { client } from "./helpers/get-client";
import { byStatusAndNextRun } from "../../graphql-code/queries";
import {
  createExportTask,
  updateRecurringExport,
} from "../../graphql-code/mutations";
import { RecurringExportStatus, ExportStatus } from "../../graphql-code/API";

export const handler: Handler = async () => {
  console.log("Starting recurring export scheduler");

  try {
    const now = new Date();
    const nowIso = now.toISOString();
    console.log({ now, nowIso });

    // Query for active recurring exports that are due to run
    const { data, errors } = await client.graphql({
      query: byStatusAndNextRun,
      variables: {
        status: RecurringExportStatus.active,
        nextRunAt: { le: nowIso },
        limit: 100,
      },
    });

    if (errors) {
      console.error("Error querying due exports:", errors);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to query due exports" }),
      };
    }

    const dueExports = data?.byStatusAndNextRun?.items || [];

    if (dueExports.length === 0) {
      console.log("No due recurring exports found");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No exports to schedule" }),
      };
    }

    console.log(`Found ${dueExports.length} due recurring exports`);

    const results = await Promise.allSettled(
      dueExports.map(async (recurringExport) => {
        try {
          if (!recurringExport.identityId) {
            console.warn(
              `Skipping recurring export ${recurringExport.id}: missing identityId (created before the identity-path fix — migrate it before it can run)`
            );
            return {
              recurringExportId: recurringExport.id,
              skipped: "missing identityId",
            };
          }

          // Calculate date range for the export
          const endDate = now;
          const startDate = subDays(endDate, recurringExport.daysToInclude);

          const { data: createData, errors: createErrors } =
            await client.graphql({
              query: createExportTask,
              variables: {
                input: {
                  owner: recurringExport.owner,
                  dataSource: recurringExport.dataSource,
                  itemId: recurringExport.itemId,
                  itemName: recurringExport.itemName,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                  status: ExportStatus.CREATED,
                  recurringExportId: recurringExport.id,
                  identityId: recurringExport.identityId,
                  ttl: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
                },
              },
            });

          if (createErrors) {
            console.error(
              `Error creating export task for recurring export ${recurringExport.id}:`,
              createErrors
            );
            throw new Error("Failed to create export task");
          }

          const exportTaskId = createData?.createExportTask?.id;
          console.log(
            `Created export task ${exportTaskId} for recurring export ${recurringExport.id}`
          );

          // Calculate next run time
          const nextRun = calculateNextRun(
            {
              frequency: recurringExport.frequency,
              dayOfWeek: recurringExport.dayOfWeek ?? undefined,
              dayOfMonth: recurringExport.dayOfMonth ?? undefined,
              timeOfDay: recurringExport.timeOfDay,
            },
            now
          );

          // Update recurring export with lastRunAt and nextRunAt
          const { errors: updateErrors } = await client.graphql({
            query: updateRecurringExport,
            variables: {
              input: {
                id: recurringExport.id,
                lastRunAt: nowIso,
                nextRunAt: nextRun.toISOString(),
                errorCount: 0, // Reset error count on successful scheduling
                lastError: null,
              },
            },
          });

          if (updateErrors) {
            console.error(
              `Error updating recurring export ${recurringExport.id}:`,
              updateErrors
            );
            // Don't throw - the export task was created successfully
          }

          return {
            recurringExportId: recurringExport.id,
            exportTaskId: exportTaskId,
            nextRunAt: nextRun.toISOString(),
          };
        } catch (error) {
          console.error(
            `Failed to process recurring export ${recurringExport.id}:`,
            error
          );

          // Update error count and last error message
          const errorCount = (recurringExport.errorCount ?? 0) + 1;
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

          // Deactivate after 5 consecutive failures
          const shouldDeactivate = errorCount >= 5;

          await client.graphql({
            query: updateRecurringExport,
            variables: {
              input: {
                id: recurringExport.id,
                errorCount,
                lastError: errorMessage,
                ...(shouldDeactivate && {
                  status: RecurringExportStatus.inactive,
                }),
              },
            },
          });

          if (shouldDeactivate) {
            console.error(
              `Deactivated recurring export ${recurringExport.id} after ${errorCount} failures`
            );
          }

          throw error;
        }
      })
    );

    // Count successes and failures
    const successes = results.filter((r) => r.status === "fulfilled").length;
    const failures = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Scheduled ${successes} recurring exports, ${failures} failures`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        scheduled: successes,
        failed: failures,
        total: dueExports.length,
      }),
    };
  } catch (error) {
    console.error("Unexpected error in scheduler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
