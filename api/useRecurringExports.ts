import { type Schema } from "@/amplify/data/resource";
import { client } from "@/lib/amplify";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { calculateNextRun } from "@/amplify/functions/process-export-tasks/helpers/calculate-next-run";
import { v4 } from "uuid";

export type RecurringExport = Schema["RecurringExport"]["type"];
export type RecurringExportStatus = Schema["RecurringExportStatus"]["type"];
export type RecurrenceFrequency = Schema["RecurrenceFrequency"]["type"];
export type ExportTaskDataSource = Schema["ExportTaskDataSource"]["type"];

export interface CreateRecurringExportInput {
  name: string;
  dataSource: ExportTaskDataSource;
  itemId: string;
  itemName?: string;
  frequency: RecurrenceFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay: string;
  daysToInclude: number;
}

/**
 * Fetcher function for SWR to load recurring exports for the current user
 */
const fetchRecurringExports =
  (status: RecurringExportStatus) => async (): Promise<RecurringExport[]> => {
    const { data, errors } =
      await client.models.RecurringExport.byStatusAndNextRun(
        { status },
        { sortDirection: "ASC", limit: 100 }
      );
    if (errors) {
      handleApiErrors(errors, "Failed fetching recurring exports");
      return [];
    }
    return data || [];
  };

/**
 * Hook to fetch and manage recurring exports
 */
export const useRecurringExports = (status: RecurringExportStatus) => {
  const {
    data: recurringExports,
    error,
    mutate,
    isLoading,
  } = useSWR<RecurringExport[]>(
    `/api/recurring-exports/${status}`,
    fetchRecurringExports(status)
  );

  /**
   * Create a new recurring export
   */
  const createRecurringExport = async (
    input: CreateRecurringExportInput
  ): Promise<RecurringExport | null> => {
    const nextRunAt = calculateNextRun(
      {
        frequency: input.frequency,
        dayOfWeek: input.dayOfWeek,
        dayOfMonth: input.dayOfMonth,
        timeOfDay: input.timeOfDay,
      },
      new Date()
    );

    const toBeCreated: RecurringExport = {
      ...input,
      status: "active",
      nextRunAt: nextRunAt.toISOString(),
      id: v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated: RecurringExport[] = [
      ...(recurringExports || []),
      toBeCreated,
    ];
    mutate(updated, false);

    const { data, errors } = await client.models.RecurringExport.create({
      ...input,
      status: "active",
      nextRunAt: nextRunAt.toISOString(),
    });

    if (errors) {
      handleApiErrors(errors, "Failed creating recurring export");
      return null;
    }

    mutate(updated);

    return data;
  };

  /**
   * Update a recurring export
   */
  const updateRecurringExport = async (
    id: string,
    updates: Partial<CreateRecurringExportInput>
  ): Promise<void> => {
    const existing = recurringExports?.find((e) => e.id === id);
    if (!existing) return;

    // Recalculate nextRunAt if schedule changed
    let nextRunAt: string | undefined;
    if (
      updates.frequency ||
      updates.dayOfWeek !== undefined ||
      updates.dayOfMonth !== undefined ||
      updates.timeOfDay
    ) {
      const schedule = {
        frequency: updates.frequency || existing.frequency,
        dayOfWeek: updates.dayOfWeek ?? existing.dayOfWeek ?? undefined,
        dayOfMonth: updates.dayOfMonth ?? existing.dayOfMonth ?? undefined,
        timeOfDay: updates.timeOfDay || existing.timeOfDay,
      };
      nextRunAt = calculateNextRun(schedule, new Date()).toISOString();
    }

    const updated = recurringExports?.map((e) =>
      e.id !== id ? e : { ...e, ...updates, ...(nextRunAt && { nextRunAt }) }
    );
    if (updated) mutate(updated, false);

    const { errors } = await client.models.RecurringExport.update({
      id,
      ...updates,
      ...(nextRunAt && { nextRunAt }),
    });

    if (errors) handleApiErrors(errors, "Failed updating recurring export");

    if (updated) mutate(updated);
  };

  /**
   * Delete a recurring export
   */
  const deleteRecurringExport = async (id: string): Promise<void> => {
    const updated = recurringExports?.filter((e) => e.id !== id);
    if (updated) mutate(updated, false);

    const { errors } = await client.models.RecurringExport.delete({ id });

    if (errors) handleApiErrors(errors, "Failed deleting recurring export");

    if (updated) mutate(updated);
  };

  /**
   * Activate a recurring export
   */
  const activateRecurringExport = async (id: string): Promise<void> => {
    const existing = recurringExports?.find((e) => e.id === id);
    if (!existing) return;

    // Calculate new nextRunAt from now
    const nextRunAt = calculateNextRun(
      {
        frequency: existing.frequency,
        dayOfWeek: existing.dayOfWeek ?? undefined,
        dayOfMonth: existing.dayOfMonth ?? undefined,
        timeOfDay: existing.timeOfDay,
      },
      new Date()
    ).toISOString();

    const updated = recurringExports?.filter((ex) => ex.id !== id);
    if (updated) mutate(updated, false);

    const { errors } = await client.models.RecurringExport.update({
      id,
      status: "active",
      nextRunAt,
      errorCount: 0,
      lastError: null,
    });

    if (errors) handleApiErrors(errors, "Failed activating recurring export");

    if (updated) mutate(updated);
  };

  /**
   * Deactivate a recurring export
   */
  const deactivateRecurringExport = async (id: string): Promise<void> => {
    const updated = recurringExports?.filter((e) => e.id !== id);
    if (updated) mutate(updated, false);

    const { errors } = await client.models.RecurringExport.update({
      id,
      status: "inactive",
    });

    if (errors) handleApiErrors(errors, "Failed deactivating recurring export");

    if (updated) mutate(updated);
  };

  return {
    recurringExports,
    error,
    loading: isLoading,
    mutate,
    createRecurringExport,
    updateRecurringExport,
    deleteRecurringExport,
    activateRecurringExport,
    deactivateRecurringExport,
  };
};
