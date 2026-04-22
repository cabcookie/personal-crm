import { queryByIndex, batchGetItems, getItem } from "./dynamodb";
import { renderDoc, bumpHeadings } from "./tiptap-doc";
import {
  fetchProjectsForAccount,
  isActiveOrRecentlyDone,
  renderProjectsSection,
  type DateWindow,
} from "./projects";
import type { ExportTask } from "./load-task-record";

/* ============================= types =============================== */

type OwnerOpts = { owner: string };

export type AccountRecord = {
  id: string;
  name: string;
  introduction?: string | null;
  introductionJson?: unknown;
  [k: string]: unknown;
};

type LearningRecord = {
  id: string;
  accountId: string;
  learnedOn?: string | null;
  learning?: unknown;
  [k: string]: unknown;
};

/* =========================== introduction ========================== */

const resolveIntroduction = (account: AccountRecord): string => {
  if (account.introductionJson)
    return renderDoc(account.introductionJson as Parameters<typeof renderDoc>[0]);
  return account.introduction ?? "";
};

/* ============================ learnings ============================ */

const fetchLearnings = (
  accountId: string,
  opts: OwnerOpts
): Promise<LearningRecord[]> =>
  queryByIndex<LearningRecord>(
    "AccountLearning",
    "accountLearningsByAccountId",
    "accountId",
    accountId,
    opts
  );

const renderLearnings = (
  learnings: LearningRecord[],
  sectionLevel: number
): string => {
  const dateLevel = sectionLevel + 1;
  const bumpBy = Math.max(0, dateLevel - 2);
  return learnings
    .filter((l) => l.learnedOn)
    .slice()
    .sort((a, b) => ((a.learnedOn ?? "") < (b.learnedOn ?? "") ? 1 : -1))
    .map((l) => {
      const body = bumpHeadings(
        renderDoc(l.learning as Parameters<typeof renderDoc>[0]),
        bumpBy
      ).trim();
      return `${"#".repeat(dateLevel)} ${l.learnedOn}\n\n${body}`;
    })
    .join("\n\n");
};

/* ============================ subsidiaries ========================= */

const fetchAllSubsidiaries = async (
  rootId: string,
  opts: OwnerOpts
): Promise<AccountRecord[]> => {
  const collected: AccountRecord[] = [];
  const seen = new Set<string>([rootId]);
  let frontier: string[] = [rootId];
  while (frontier.length) {
    const batches = await Promise.all(
      frontier.map((id) =>
        queryByIndex(
          "Account",
          "gsi-Account.subsidiaries",
          "accountSubsidiariesId",
          id,
          opts
        )
      )
    );
    const childIds: string[] = [];
    for (const batch of batches) {
      for (const row of batch) {
        const rid = (row as { id?: string }).id;
        if (rid && !seen.has(rid)) {
          seen.add(rid);
          childIds.push(rid);
        }
      }
    }
    if (!childIds.length) break;
    const map = await batchGetItems<AccountRecord>("Account", childIds, opts);
    collected.push(
      ...childIds
        .map((id) => map.get(id))
        .filter((a): a is AccountRecord => !!a)
    );
    frontier = childIds;
  }
  return collected;
};

/* =========================== body builder ========================== */

type BuildOpts = OwnerOpts & {
  isSubsidiary?: boolean;
  dateWindow: DateWindow;
};

type BuildResult = {
  body: string;
  counts: {
    learnings: number;
    projectsTotal: number;
    projectsRendered: number;
  };
};

export const buildAccountBody = async (
  account: AccountRecord,
  opts: BuildOpts
): Promise<BuildResult> => {
  const { owner, isSubsidiary = false, dateWindow } = opts;
  const accountLevel = isSubsidiary ? 2 : 1;
  const sectionLevel = accountLevel + 1;
  const label = isSubsidiary ? "Subsidiary" : "Account";
  const sections: string[] = [
    `${"#".repeat(accountLevel)} ${label}: ${account.name}`,
  ];

  const intro = bumpHeadings(
    resolveIntroduction(account),
    Math.max(0, sectionLevel - 2)
  ).trim();
  if (intro) {
    sections.push(`${"#".repeat(sectionLevel)} Introduction`);
    sections.push(intro);
  }

  const learnings = await fetchLearnings(account.id, { owner });
  const learningsBody = renderLearnings(learnings, sectionLevel);
  if (learningsBody) {
    sections.push(
      `${"#".repeat(sectionLevel)} What we learned about ${account.name}`
    );
    sections.push(learningsBody);
  }

  const allProjects = await fetchProjectsForAccount(account.id, {
    owner,
    withActivities: true,
    dateWindow,
  });
  const projects = allProjects
    .filter((p) => isActiveOrRecentlyDone(p))
    .sort((a, b) => (a.project ?? "").localeCompare(b.project ?? ""));
  const projectsBody = renderProjectsSection(
    account.name,
    projects,
    sectionLevel
  );
  if (projectsBody) sections.push(projectsBody);

  const hasContent = sections.length > 1;
  return {
    body: hasContent ? sections.join("\n\n") : "",
    counts: {
      learnings: learnings.length,
      projectsTotal: allProjects.length,
      projectsRendered: projects.length,
    },
  };
};

/* =========================== entry point =========================== */

/**
 * Entry point used by the export handler for `dataSource === "account"`.
 * Renders the root account followed by each owned subsidiary (flattened BFS
 * via the gsi-Account.subsidiaries GSI). Empty subsidiaries (no intro, no
 * learnings, no in-window projects) are dropped silently.
 */
export const getAccountMd = async (task: ExportTask): Promise<string> => {
  const opts: BuildOpts = {
    owner: task.owner,
    dateWindow: { startDate: task.startDate, endDate: task.endDate },
  };

  const account = await getItem<AccountRecord>("Account", task.itemId, {
    owner: task.owner,
  });
  if (!account) {
    console.warn(
      `[export] account ${task.itemId} not found or not owned by ${task.owner}`
    );
    return "";
  }

  const root = await buildAccountBody(account, opts);
  console.log(
    `[export] root account "${account.name}" — ${root.counts.learnings} learning(s), ${root.counts.projectsRendered}/${root.counts.projectsTotal} project(s).`
  );

  const subsidiaries = await fetchAllSubsidiaries(task.itemId, {
    owner: task.owner,
  });
  const sortedSubs = subsidiaries
    .filter((s): s is AccountRecord & { name: string } => !!s.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  const subBodies: string[] = [];
  for (const sub of sortedSubs) {
    const built = await buildAccountBody(sub, { ...opts, isSubsidiary: true });
    if (built.body) {
      subBodies.push(built.body);
      console.log(
        `[export] subsidiary "${sub.name}" — ${built.counts.learnings} learning(s), ${built.counts.projectsRendered}/${built.counts.projectsTotal} project(s).`
      );
    } else {
      console.log(`[export] subsidiary "${sub.name}" skipped (empty).`);
    }
  }

  const parts = [root.body, ...subBodies].filter(Boolean);
  return parts.length ? `${parts.join("\n\n")}\n` : "";
};

// Helper for tests / external callers
export { fetchAllSubsidiaries };
