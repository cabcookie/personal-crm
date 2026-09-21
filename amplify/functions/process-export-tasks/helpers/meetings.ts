import type { ExportTask } from "./load-task-record";
import { assembleMeetingFromCache } from "./cached-assembly";

/**
 * Meeting export. Assembled from the CACHED building blocks
 * (meetingHeaderMarkdown on the Meeting + notesMarkdown on each Activity) via
 * assembleMeetingFromCache — far cheaper than live rendering, and consistent
 * with the project export and the LLM summary path. The synchronous
 * Export-for-AI refresh (see handler) makes sure the cache is fresh first.
 */
export const getMeetingMd = async (task: ExportTask): Promise<string> =>
  assembleMeetingFromCache(task.itemId, { owner: task.owner });
