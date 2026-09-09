import {
  fetchBlocks,
  fetchCurrentEmployment,
  renderBlocks,
  renderParticipant,
  type ActivityRecord,
  type BlockRecord,
} from "./activities";
import { batchGetItems, getItem, queryByIndex } from "./dynamodb";
import type { ExportTask } from "./load-task-record";

type OwnerOpts = { owner: string };

type MeetingRecord = {
  id: string;
  topic?: string | null;
  meetingOn?: string | null;
  createdAt?: string | null;
  [k: string]: unknown;
};

type ProjectRef = {
  projectName: string;
  accountNames: string[];
};

type EnrichedActivity = {
  activity: ActivityRecord;
  blocks: BlockRecord[];
  projects: ProjectRef[];
};

/* ============================ formatting =========================== */

const TIMEZONE = "Europe/Berlin";

/**
 * Format the meeting datetime as `YYYY-MM-DD HH:mm CET` in Europe/Berlin.
 * The literal "CET" suffix is used (technically CEST in summer, but the user
 * asked for "CET" as the label).
 */
const formatMeetingDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")} CET`;
};

/* ============================ fetching ============================= */

const fetchParticipants = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<string[]> => {
  const junctions = await queryByIndex(
    "MeetingParticipant",
    "gsi-Meeting.participants",
    "meetingId",
    meetingId,
    opts
  );
  const personIds = junctions
    .map((j) => (j as { personId?: string }).personId)
    .filter((id): id is string => !!id);
  const personMap = await batchGetItems<{ id: string; name?: string }>(
    "Person",
    personIds,
    opts
  );
  const people = personIds
    .map((id) => personMap.get(id))
    .filter((p): p is { id: string; name: string } => !!p && !!p.name);
  const employments = await Promise.all(
    people.map((p) => fetchCurrentEmployment(p.id, opts))
  );
  return people.map((p, i) => renderParticipant(p.name, employments[i]));
};

const fetchActivitiesForMeeting = async (
  meetingId: string,
  opts: OwnerOpts
): Promise<ActivityRecord[]> => {
  return queryByIndex<ActivityRecord>(
    "Activity",
    "gsi-Meeting.activities",
    "meetingActivitiesId",
    meetingId,
    opts
  );
};

const fetchProjectsForActivity = async (
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

  // For each project, fetch its linked accounts via the AccountProjects junction.
  const refs = await Promise.all(
    projectIds.map(async (projectId): Promise<ProjectRef | null> => {
      const project = projectMap.get(projectId);
      if (!project?.project) return null;
      const accountJunctions = await queryByIndex(
        "AccountProjects",
        "accountProjectsByProjectsId",
        "projectsId",
        projectId,
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

/* ============================ rendering ============================ */

const renderProjects = (projects: ProjectRef[]): string =>
  projects
    .map((p) =>
      p.accountNames.length
        ? `${p.projectName} (${p.accountNames.join(", ")})`
        : p.projectName
    )
    .join(", ");

const renderActivityBlock = (entry: EnrichedActivity): string => {
  const topic = renderProjects(entry.projects);
  const body = renderBlocks(entry.blocks);
  const head = `## Topic: ${topic}`;
  return body ? `${head}\n\n${body}` : head;
};

const pickActivityDate = (a: ActivityRecord): string =>
  a.finishedOn || a.createdAt || a.updatedAt || "";

/* =========================== entry point =========================== */

export const getMeetingMd = async (task: ExportTask): Promise<string> => {
  const meeting = await getItem<MeetingRecord>("Meeting", task.itemId, {
    owner: task.owner,
  });
  if (!meeting) {
    console.warn(
      `[export] meeting ${task.itemId} not found or not owned by ${task.owner}`
    );
    return "";
  }

  const [participants, activities] = await Promise.all([
    fetchParticipants(meeting.id, { owner: task.owner }),
    fetchActivitiesForMeeting(meeting.id, { owner: task.owner }),
  ]);

  const enriched = await Promise.all(
    activities.map(async (activity): Promise<EnrichedActivity> => {
      const [blocks, projects] = await Promise.all([
        fetchBlocks(activity, { owner: task.owner }),
        fetchProjectsForActivity(activity.id, { owner: task.owner }),
      ]);
      return { activity, blocks, projects };
    })
  );

  // Drop activities that aren't linked to any project (per spec).
  const withProjects = enriched
    .filter((e) => e.projects.length > 0)
    .sort((a, b) => {
      const da = pickActivityDate(a.activity);
      const db = pickActivityDate(b.activity);
      return da < db ? -1 : da > db ? 1 : 0;
    });

  const dateTime = formatMeetingDateTime(
    meeting.meetingOn || meeting.createdAt
  );
  const title = meeting.topic?.trim() || "Untitled meeting";
  const heading = dateTime ? `# ${dateTime} - ${title}` : `# ${title}`;

  const sections: string[] = [heading];
  if (participants.length) {
    sections.push(
      ["Participants:", "", ...participants.map((p) => `- ${p}`)].join("\n")
    );
  }
  for (const entry of withProjects) {
    sections.push(renderActivityBlock(entry));
  }

  return `${sections.join("\n\n")}\n`;
};
