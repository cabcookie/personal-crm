import {
  fetchActivitiesForProject,
  renderActivitiesSection,
  withinDateWindow,
  type ActivityRecord,
  type DateWindow,
} from "./activities";
import { getItem, queryByIndex, batchGetItems } from "./dynamodb";
import type { ExportTask } from "./load-task-record";

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
  activities?: ActivityRecord[];
  [k: string]: unknown;
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
  const dateWindow: DateWindow = {
    startDate: task.startDate,
    endDate: task.endDate,
  };
  const project = await fetchProject(task.itemId, {
    owner: task.owner,
    withActivities: true,
    dateWindow,
  });
  if (!project) {
    console.warn(
      `[export] project ${task.itemId} not found or not owned by ${task.owner}`
    );
    return "";
  }
  const body = renderProject(project, 1);
  return body ? `${body}\n` : "";
};

// Re-export for convenience where consumers want the types.
export type { DateWindow };
