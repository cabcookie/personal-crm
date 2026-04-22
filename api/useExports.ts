import { type Schema } from "@/amplify/data/resource";
import { client } from "@/lib/amplify";
import useSWR from "swr";
import { handleApiErrors } from "./globals";

export type ExportTask = Schema["ExportTask"]["type"];

/**
 * Fetcher function for SWR to load all export tasks for the current user
 */
const fetchExportTasks = async (): Promise<ExportTask[]> => {
  const createdTasks = await fetchExportTasksWithStatus("CREATED");
  const generatedTasks = await fetchExportTasksWithStatus("GENERATED");
  return [...createdTasks, ...generatedTasks];
};

const fetchExportTasksWithStatus = async (
  status: ExportTask["status"]
): Promise<ExportTask[]> => {
  const { data, errors } =
    await client.models.ExportTask.listExportTaskByStatusAndEndDate(
      { status },
      { sortDirection: "DESC", limit: 10 }
    );
  if (errors) {
    handleApiErrors(errors, "Failed fetching export tasks");
    return [];
  }
  return data || [];
};

/**
 * Hook to fetch and manage export tasks
 */
export function useExports() {
  const { data, error, mutate, isLoading } = useSWR<ExportTask[]>(
    "/api/exports",
    fetchExportTasks
  );

  /**
   * Delete an export task
   */
  const deleteExportTask = async (taskId: string): Promise<void> => {
    const updated = data?.filter((task) => task.id !== taskId);
    if (updated) mutate(updated, false);
    const { errors } = await client.models.ExportTask.delete({
      id: taskId,
    });
    if (errors) {
      handleApiErrors(errors, "Failed deleting export task");
      return;
    }
    if (updated) mutate(updated);
  };

  /**
   * Mark an export task as completed (user has downloaded/copied it)
   */
  const markExportCompleted = async (taskId: string): Promise<void> => {
    const updated = data?.map((task) =>
      task.id !== taskId
        ? task
        : ({ ...task, status: "COMPLETED" } as ExportTask)
    );
    if (updated) mutate(updated, false);
    const { errors } = await client.models.ExportTask.update({
      id: taskId,
      status: "COMPLETED",
    });
    if (errors) {
      handleApiErrors(errors, "Failed to mark export as completed");
      return;
    }
    if (updated) mutate(updated);
  };

  return {
    exports: data,
    error,
    loading: isLoading,
    mutate,
    deleteExportTask,
    markExportCompleted,
  };
}
