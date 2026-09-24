import { batchGetItems, getItem, queryByIndex } from "./dynamodb";
import { bumpHeadings } from "./tiptap-doc";
import type { ActivityRecord, DateWindow } from "./activities";

/**
 * Assemble project / meeting markdown from the CACHED per-record building
 * blocks written by the debounced pipeline:
 *   - Activity.notesMarkdown           note body (renderBlocks output)
 *   - Activity.activityHeaderMarkdown  "Topic: <projects>" | activity date
 *   - Meeting.meetingHeaderMarkdown    "<de date>, Meeting: <topic>" +
 *                                       "**Participants:** …" +
 *                                       "**People mentioned:** …"
 *
 * No live block rendering — just reads + string assembly, so it is much faster
 * than the original renderers and shared by the export Lambda AND the
 * project-summary Lambda (and the synchronous Export-for-AI refresh path).
 *
 * The cached blocks never carry a leading '#'; each export decides the heading
 * level here and bumps the body's own headings to nest beneath it.
 */

type OwnerOpts = { owner: string };

type CachedActivity = ActivityRecord & {
  notesMarkdown?: string | null;
  activityHeaderMarkdown?: string | null;
  meetingActivitiesId?: string | null;
};

type CachedMeeting = {
  id: string;
  meetingOn?: string | null;
  createdAt?: string | null;
  meetingHeaderMarkdown?: string | null;
};

const effectiveDateMs = (
  a: CachedActivity,
  meetingById: Map<string, CachedMeeting>
): number => {
  const meetingOn = a.meetingActivitiesId
    ? meetingById.get(a.meetingActivitiesId)?.meetingOn
    : null;
  const iso = meetingOn || a.finishedOn || a.createdAt || null;
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/* ============================== project ============================== */

/**
 * Assemble a single project's notes from cache, newest activity first. Each
 * activity heading is the meeting header (meeting-linked) or the activity's
 * own header (the date, for standalone notes); the body follows. No "Topic:"
 * line — we are already inside one project.
 *
 * `activityHeadingLevel` defaults to 3 (`### `), matching the original project
 * export. The body's headings are bumped by (level - 2).
 *
 * When `dateWindow` is given, only activities whose effective date falls inside
 * [startDate, endDate] (inclusive, calendar-day granularity) are included — the
 * same window semantics the account export uses. Without it, all activities are
 * rendered.
 */
export const assembleProjectFromCache = async (
  projectId: string,
  opts: OwnerOpts,
  activityHeadingLevel = 3,
  dateWindow?: DateWindow
): Promise<string> => {
  const junctions = await queryByIndex(
    "ProjectActivity",
    "projectActivitiesByProjectsId",
    "projectsId",
    projectId,
    opts
  );
  const activityIds = [
    ...new Set(
      junctions
        .map((j) => (j as { activityId?: string }).activityId)
        .filter((id): id is string => !!id)
    ),
  ];
  if (!activityIds.length) return "";

  const activityMap = await batchGetItems<CachedActivity>(
    "Activity",
    activityIds,
    opts
  );
  const activities = activityIds
    .map((id) => activityMap.get(id))
    .filter(
      (a): a is CachedActivity => !!a && !!(a.notesMarkdown ?? "").trim()
    );
  if (!activities.length) return "";

  const meetingIds = [
    ...new Set(
      activities
        .map((a) => a.meetingActivitiesId)
        .filter((id): id is string => !!id)
    ),
  ];
  const meetingById = meetingIds.length
    ? await batchGetItems<CachedMeeting>("Meeting", meetingIds, opts)
    : new Map<string, CachedMeeting>();

  const hashes = "#".repeat(activityHeadingLevel);
  const bumpBy = Math.max(0, activityHeadingLevel - 2);

  // Restrict to the export's date window when given. Inclusive on both ends at
  // calendar-day granularity: compare against [startOfDay(start), endOfDay(end)]
  // so the whole end day counts (mirrors withinDateWindow's semantics).
  const inWindow = (a: CachedActivity): boolean => {
    if (!dateWindow) return true;
    const t = effectiveDateMs(a, meetingById);
    if (!t) return false;
    const startMs = new Date(dateWindow.startDate).setHours(0, 0, 0, 0);
    const endMs = new Date(dateWindow.endDate).setHours(23, 59, 59, 999);
    return t >= startMs && t <= endMs;
  };

  const windowed = activities.filter(inWindow);
  if (!windowed.length) return "";

  return windowed
    .slice()
    .sort(
      (a, b) =>
        effectiveDateMs(b, meetingById) - effectiveDateMs(a, meetingById)
    )
    .map((a) => {
      const header = a.meetingActivitiesId
        ? meetingById.get(a.meetingActivitiesId)?.meetingHeaderMarkdown?.trim()
        : a.activityHeaderMarkdown?.trim();
      const body = bumpHeadings((a.notesMarkdown ?? "").trim(), bumpBy);
      return `${hashes} ${header ?? ""}\n\n${body}`;
    })
    .join("\n\n");
};

/* ============================== meeting ============================== */

type ProjectRef = { projectName: string; accountNames: string[] };

const renderTopic = (projects: ProjectRef[]): string =>
  projects
    .map((p) =>
      p.accountNames.length
        ? `${p.projectName} (${p.accountNames.join(", ")})`
        : p.projectName
    )
    .join(", ");

const fetchProjectRefsForActivity = async (
  activityId: string,
  opts: OwnerOpts
): Promise<ProjectRef[]> => {
  const projectJunctions = await queryByIndex(
    "ProjectActivity",
    "gsi-Activity.forProjects",
    "activityId",
    activityId,
    opts
  );
  const projectIds = projectJunctions
    .map((j) => (j as { projectsId?: string }).projectsId)
    .filter((id): id is string => !!id);
  if (!projectIds.length) return [];
  const projectMap = await batchGetItems<{ id: string; project?: string }>(
    "Projects",
    projectIds,
    opts
  );
  const refs = await Promise.all(
    projectIds.map(async (pid): Promise<ProjectRef | null> => {
      const project = projectMap.get(pid);
      if (!project?.project) return null;
      const accountJunctions = await queryByIndex(
        "AccountProjects",
        "accountProjectsByProjectsId",
        "projectsId",
        pid,
        opts
      );
      const accountIds = accountJunctions
        .map((j) => (j as { accountId?: string }).accountId)
        .filter((id): id is string => !!id);
      const accountMap = await batchGetItems<{ id: string; name?: string }>(
        "Account",
        accountIds,
        opts
      );
      const accountNames = accountIds
        .map((id) => accountMap.get(id)?.name)
        .filter((n): n is string => !!n);
      return { projectName: project.project, accountNames };
    })
  );
  return refs.filter((r): r is ProjectRef => !!r);
};

const pickActivityDate = (a: CachedActivity): string =>
  a.finishedOn || a.createdAt || (a.updatedAt as string | undefined) || "";

/**
 * Assemble a meeting's markdown from cache:
 *   # <meetingHeaderMarkdown>
 *   ## Topic: <project (accounts)>     (live — the account suffix isn't cached)
 *   <notesMarkdown body>
 * Only activities linked to at least one project are included (as before).
 */
export const assembleMeetingFromCache = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<string> => {
  const meeting = await getItem<CachedMeeting>("Meeting", meetingId, opts);
  if (!meeting) {
    console.warn(`[export] meeting ${meetingId} not found or not owned`);
    return "";
  }

  const activities = await queryByIndex<CachedActivity>(
    "Activity",
    "gsi-Meeting.activities",
    "meetingActivitiesId",
    meetingId,
    opts
  );

  const enriched = await Promise.all(
    activities.map(async (activity) => ({
      activity,
      projects: await fetchProjectRefsForActivity(activity.id, opts),
    }))
  );
  const withProjects = enriched
    .filter((e) => e.projects.length > 0)
    .sort((a, b) => {
      const da = pickActivityDate(a.activity);
      const db = pickActivityDate(b.activity);
      return da < db ? -1 : da > db ? 1 : 0;
    });

  const header = meeting.meetingHeaderMarkdown?.trim();
  const sections: string[] = [`# ${header ?? ""}`];
  for (const { activity, projects } of withProjects) {
    const topic = `## Topic: ${renderTopic(projects)}`;
    const body = bumpHeadings((activity.notesMarkdown ?? "").trim(), 1);
    sections.push(body ? `${topic}\n\n${body}` : topic);
  }
  return `${sections.join("\n\n")}\n`;
};
