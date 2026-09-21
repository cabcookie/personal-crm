import {
  computeActivityBody,
  computeActivityHeader,
  loadActivity,
} from "./lib/render";
import { updateItemAttributes } from "./lib/ddb-write";

/**
 * Activity snapshot Lambda.
 *
 * Invoked by a one-time EventBridge schedule ~5 minutes after the last note
 * change on an activity (or synchronously by the Export-for-AI path). It
 * caches two context-free building blocks on the Activity:
 *   - notesMarkdown          the note-block body (renderBlocks)
 *   - activityHeaderMarkdown  "Topic: <projects>" (meeting) or the date
 *
 * Both are written together so the export/summary always read a consistent
 * pair. Payload: `{ activityId: string }`.
 */

type Event = { activityId?: string };

/** Exported so the Export-for-AI path can run it inline (no scheduler). */
export const runActivitySnapshot = async (
  activityId: string
): Promise<void> => {
  const activity = await loadActivity(activityId);
  if (!activity) {
    console.warn(`[snapshot] activity ${activityId} not found; skipping`);
    return;
  }
  const owner = activity.owner;
  if (!owner) {
    console.warn(`[snapshot] activity ${activityId} has no owner; skipping`);
    return;
  }

  const [body, header] = await Promise.all([
    computeActivityBody(activity, { owner }),
    computeActivityHeader(activity, { owner }),
  ]);

  const now = new Date().toISOString();
  await updateItemAttributes(
    "Activity",
    activityId,
    {
      notesMarkdown: body,
      notesMarkdownUpdatedAt: now,
      activityHeaderMarkdown: header,
      activityHeaderMarkdownUpdatedAt: now,
    },
    owner
  );

  console.log(`[snapshot] wrote body+header for activity ${activityId}`, {
    bodyLength: body.length,
    header,
  });
};

export const handler = async (event: Event): Promise<void> => {
  const { activityId } = event;
  if (!activityId) {
    console.warn("[snapshot] no activityId in event; skipping");
    return;
  }
  await runActivitySnapshot(activityId);
};
