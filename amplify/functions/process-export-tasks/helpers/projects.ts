import {
  fetchActivitiesForProject,
  renderActivitiesSection,
  withinDateWindow,
  type ActivityRecord,
  type DateWindow,
} from "./activities";
import { getItem, queryByIndex, batchGetItems } from "./dynamodb";
import type { ExportTask } from "./load-task-record";
import { assembleProjectFromCache } from "./cached-assembly";

/* ============================ constants ============================ */

const DAYS_CUTOFF = 90;

/* ============================= types =============================== */

type OwnerOpts = { owner: string };

export type ProjectRecord = {
  id: string;
  project: string;
  done?: boolean | null;
  doneOn?: string | null;
  dueOn?: string | null;
  onHoldTill?: string | null;
  partnerId?: string | null;
  partnerName?: string | null;
  projectSummary?: string | null;
  activities?: ActivityRecord[];
  [k: string]: unknown;
};

/**
 * The AI-generated project summary as a `## Summary` section, or "" when the
 * project has no summary yet. Included in exports regardless of the date window
 * (it is a whole-project summary, not a windowed slice) so the reader always
 * gets the overall context before the (windowed) notes.
 */
const renderSummarySection = (
  project: ProjectRecord,
  headingLevel: number
): string => {
  const summary = (project.projectSummary ?? "").trim();
  if (!summary) return "";
  return `${"#".repeat(headingLevel)} Summary\n\n${summary}`;
};

/* ============================ fetching ============================= */

const daysSince = (isoDate: string): number => {
  const then = new Date(`${isoDate}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
};

const fetchPartnerName = async (
  partnerId: string | null | undefined,
  opts: OwnerOpts
): Promise<string | null> => {
  if (!partnerId) return null;
  const partner = await getItem<{ name?: string | null }>(
    "Account",
    partnerId,
    opts
  );
  return partner?.name ?? null;
};

const enrichProject = async (
  project: ProjectRecord,
  opts: OwnerOpts & { withActivities?: boolean; dateWindow?: DateWindow }
): Promise<ProjectRecord> => {
  const [partnerName, activities] = await Promise.all([
    fetchPartnerName(project.partnerId, opts),
    opts.withActivities
      ? fetchActivitiesForProject(project.id, opts)
      : Promise.resolve(undefined),
  ]);
  const filtered =
    activities && opts.dateWindow
      ? activities.filter((a) => withinDateWindow(a, opts.dateWindow!))
      : activities;
  return {
    ...project,
    partnerName,
    ...(filtered ? { activities: filtered } : {}),
  };
};

export const fetchProject = async (
  projectId: string,
  opts: OwnerOpts & { withActivities?: boolean; dateWindow?: DateWindow }
): Promise<ProjectRecord | null> => {
  const project = await getItem<ProjectRecord>("Projects", projectId, opts);
  if (!project) return null;
  return enrichProject(project, opts);
};

export const fetchProjectsForAccount = async (
  accountId: string,
  opts: OwnerOpts & { withActivities?: boolean; dateWindow?: DateWindow }
): Promise<ProjectRecord[]> => {
  const junctions = await queryByIndex(
    "AccountProjects",
    "accountProjectsByAccountId",
    "accountId",
    accountId,
    opts
  );
  const projectIds = junctions
    .map((j) => (j as { projectsId?: string }).projectsId)
    .filter((id): id is string => !!id);
  const projectMap = await batchGetItems<ProjectRecord>(
    "Projects",
    projectIds,
    opts
  );
  const projects = projectIds
    .map((id) => projectMap.get(id))
    .filter((p): p is ProjectRecord => !!p);
  return Promise.all(projects.map((p) => enrichProject(p, opts)));
};

/* ============================ filtering ============================ */

export const isActiveOrRecentlyDone = (
  project: ProjectRecord,
  cutoffDays = DAYS_CUTOFF
): boolean => {
  if (!project.done) return true;
  if (!project.doneOn) return false;
  return daysSince(project.doneOn) <= cutoffDays;
};

/* ============================ rendering ============================ */

export const renderProject = (
  project: ProjectRecord,
  headingLevel = 3
): string => {
  const body: string[] = [];
  const meta: string[] = [];
  if (project.dueOn) meta.push(`**Due:** ${project.dueOn}`);
  if (project.done && project.doneOn) meta.push(`**Done:** ${project.doneOn}`);
  if (project.partnerName) meta.push(`**Partner:** ${project.partnerName}`);
  if (meta.length) body.push(meta.join("\n"));
  const summarySection = renderSummarySection(project, headingLevel + 1);
  if (summarySection) body.push(summarySection);
  if (project.activities?.length) {
    const notes = renderActivitiesSection(project.activities, headingLevel + 1);
    if (notes) body.push(notes);
  }
  if (!body.length) return "";
  const hashes = "#".repeat(headingLevel);
  return [`${hashes} Project: ${project.project}`, ...body].join("\n\n");
};

export const renderProjectsSection = (
  accountName: string,
  projects: ProjectRecord[],
  sectionLevel = 2
): string => {
  const projectLevel = sectionLevel + 1;
  const rendered = projects
    .map((p) => renderProject(p, projectLevel))
    .filter(Boolean);
  if (!rendered.length) return "";
  const header = `${"#".repeat(sectionLevel)} Projects with ${accountName}`;
  return [header, rendered.join("\n\n")].join("\n\n");
};

/* =========================== entry point =========================== */

/**
 * Entry point used by the export handler for `dataSource === "project"`.
 * Renders a single project (with heading level 1, so `# Project: …`) including
 * all activities whose effective date falls inside [task.startDate,
 * task.endDate].
 */
export const getProjectMd = async (task: ExportTask): Promise<string> => {
  // Fetch the project itself (name + meta + partner) but NOT its activities —
  // the activity notes are assembled from cache (notesMarkdown + cached
  // headers) via assembleProjectFromCache, which is far cheaper than the old
  // live block rendering. The synchronous Export-for-AI refresh makes the
  // cache fresh before this runs.
  const project = await fetchProject(task.itemId, { owner: task.owner });
  if (!project) {
    console.warn(
      `[export] project ${task.itemId} not found or not owned by ${task.owner}`
    );
    return "";
  }

  const meta: string[] = [];
  if (project.dueOn) meta.push(`**Due:** ${project.dueOn}`);
  if (project.done && project.doneOn) meta.push(`**Done:** ${project.doneOn}`);
  if (project.partnerName) meta.push(`**Partner:** ${project.partnerName}`);

  const notes = await assembleProjectFromCache(
    task.itemId,
    { owner: task.owner },
    2, // activity headings at "## " under the "# Project: …" title
    { startDate: task.startDate, endDate: task.endDate }
  );

  const summarySection = renderSummarySection(project, 2);

  const parts: string[] = [`# Project: ${project.project}`];
  if (meta.length) parts.push(meta.join("\n"));
  if (summarySection) parts.push(summarySection);
  if (notes) parts.push(notes);
  // Title + summary alone is worth exporting; only bail if there's nothing
  // beyond the title.
  if (parts.length === 1) return "";
  return `${parts.join("\n\n")}\n`;
};

// Re-export for convenience where consumers want the types.
export type { DateWindow };
