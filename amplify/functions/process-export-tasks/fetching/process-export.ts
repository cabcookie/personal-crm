import {
  ExportTask,
  getAccountMd,
  getMeetingMd,
  getProjectMd,
} from "../helpers";
import {
  refreshMeetingCache,
  refreshProjectCache,
} from "../helpers/refresh-cache";

export const processExport = async (task: ExportTask): Promise<string> => {
  console.log("Processing export", task);

  // TODO: export of person data

  switch (task.dataSource) {
    case "account":
      return await getAccountMd(task);
    case "project":
      // Refresh the cached building blocks synchronously so the export never
      // reads stale/missing cache (e.g. right after a meeting, before the
      // debounce fired), then assemble from cache.
      await refreshProjectCache(task.itemId, task.owner);
      return await getProjectMd(task);
    case "meeting":
      await refreshMeetingCache(task.itemId, task.owner);
      return await getMeetingMd(task);
    default:
      throw new Error(`Unknown data source: ${task.dataSource}`);
  }
};
