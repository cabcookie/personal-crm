import { createHash } from "crypto";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import {
  allDocuments,
  buildExport,
  imageUsage,
  learningStatusCounts,
  type ExportData,
  type RawTables,
} from "./lib/build";
import { applyFileHashes } from "./lib/documents";
import {
  deleteObject,
  fetchFile,
  getUser,
  putFile,
  putJson,
  scanByOwner,
} from "./lib/io";
import type { FileEntry, Manifest } from "./lib/types";
import { ZipFileWriter } from "./lib/zip";

/**
 * Migration export for nexflow.it (board 9q33.5a2k, format in
 * docs/migration-export-format.md).
 *
 * Invoked asynchronously by the `startMigrationExport` mutation. Reads all of
 * the caller's data, writes `exports/<identityId>/migration/<stamp>.zip` and
 * signals progress through sibling objects the app lists:
 *   <stamp>.running.json  while the export runs (deleted at the end)
 *   <stamp>.error.json    when it failed
 * Read-only towards the data tables.
 */

type AppSyncIdentity = {
  sub?: string;
  username?: string;
  claims?: { sub?: string; "cognito:username"?: string };
};

type Event = {
  arguments?: { identityId?: string };
  identity?: AppSyncIdentity;
};

const IDENTITY_ID = /^[a-z]{2}(-[a-z]+)+-\d:[0-9a-f-]{36}$/;

const DATA_TABLES = [
  "Person",
  "PersonDetail",
  "PersonAccount",
  "PersonRelationship",
  "PersonLearning",
  "Account",
  "AccountLearning",
  "AccountLearningPerson",
  "Projects",
  "AccountProjects",
  "Meeting",
  "MeetingParticipant",
  "Activity",
  "ProjectActivity",
  "NoteBlock",
  "Todo",
] as const;

/** Reconstructs the `sub::username` owner the data tables store. */
const ownerFromIdentity = (identity?: AppSyncIdentity): string | null => {
  const sub = identity?.sub ?? identity?.claims?.sub;
  const username = identity?.username ?? identity?.claims?.["cognito:username"];
  return sub && username ? `${sub}::${username}` : null;
};

const sha256 = (data: Buffer | string) =>
  createHash("sha256").update(data).digest("hex");

const loadTables = async (owner: string): Promise<RawTables> => {
  const entries = await Promise.all(
    DATA_TABLES.map(async (model) => [model, await scanByOwner(model, owner)])
  );
  return {
    ...(Object.fromEntries(entries) as Omit<RawTables, "User">),
    User: await getUser(owner),
  };
};

/**
 * Downloads every referenced image into the archive and returns files.json.
 * Only keys under the caller's own `user-files/<identityId>/` prefix are read,
 * so a crafted note cannot pull another user's files into the export.
 */
const addFiles = async (
  data: ExportData,
  identityId: string,
  zip: ZipFileWriter
): Promise<FileEntry[]> => {
  const ownPrefix = `user-files/${identityId}/`;
  const usage = imageUsage(data);
  const hashByKey = new Map<string, string | null>();
  const written = new Set<string>();
  const entries: FileEntry[] = [];
  for (const [s3Key, activityIds] of usage) {
    const file = s3Key.startsWith(ownPrefix) ? await fetchFile(s3Key) : null;
    const hash = file ? sha256(file.data) : null;
    if (file && hash && !written.has(hash)) {
      await zip.add(`files/${hash}`, file.data, { compress: false });
      written.add(hash);
    }
    if (!file)
      data.warnings.push({
        code: "MISSING_FILE",
        entity: "files.json",
        id: s3Key,
        detail: s3Key.startsWith(ownPrefix)
          ? "object not found"
          : "key outside the user's own prefix",
      });
    hashByKey.set(s3Key, hash);
    const info = data.imageBlocks.get(s3Key);
    entries.push({
      hash,
      s3Key,
      name: s3Key.split("/").pop() ?? s3Key,
      mime: file?.mime ?? null,
      size: file ? file.data.length : null,
      missing: !file,
      description: info?.description ?? null,
      descriptionUpdatedAt: info?.descriptionUpdatedAt ?? null,
      activityIds,
    });
  }
  allDocuments(data).forEach((doc) => applyFileHashes(doc, hashByKey));
  for (const activity of data.activities)
    activity.fileHashes = [
      ...new Set(
        entries
          .filter((e) => e.hash && e.activityIds.includes(activity.id))
          .map((e) => e.hash!)
      ),
    ];
  return entries;
};

const writeArchive = async (
  owner: string,
  identityId: string,
  exportedAt: string,
  path: string
): Promise<void> => {
  const data = buildExport(await loadTables(owner));
  const zip = await ZipFileWriter.create(path);
  const files = await addFiles(data, identityId, zip);

  const dataFiles: Record<string, unknown> = {
    "profile.json": data.profile,
    "people.json": data.people,
    "relationships.json": data.relationships,
    "person-learnings.json": data.personLearnings,
    "accounts.json": data.accounts,
    "account-learnings.json": data.accountLearnings,
    "projects.json": data.projects,
    "meetings.json": data.meetings,
    "activities.json": data.activities,
    "files.json": files,
  };
  const counts: Record<string, number> = {};
  const checksums: Record<string, string> = {};
  for (const [name, value] of Object.entries(dataFiles)) {
    const json = Buffer.from(JSON.stringify(value, null, 2), "utf8");
    await zip.add(`data/${name}`, json);
    counts[name] = Array.isArray(value) ? value.length : 1;
    checksums[name] = sha256(json);
  }

  const manifest: Manifest = {
    formatVersion: 1,
    exportedAt,
    source: {
      app: "personal-crm",
      gitSha: process.env.GIT_SHA || null,
      owner,
    },
    counts,
    learningStatusCounts: learningStatusCounts(data),
    checksums,
    warnings: data.warnings,
  };
  await zip.add(
    "manifest.json",
    Buffer.from(JSON.stringify(manifest, null, 2))
  );
  await zip.finish();
  console.log("Migration export written", {
    counts,
    warnings: data.warnings.length,
  });
};

export const handler = async (event: Event): Promise<void> => {
  const owner = ownerFromIdentity(event.identity);
  const identityId = event.arguments?.identityId ?? "";
  if (!owner) throw new Error("Unauthenticated");
  if (!IDENTITY_ID.test(identityId))
    throw new Error(`Invalid identityId: ${identityId}`);

  const exportedAt = new Date().toISOString();
  const stamp = exportedAt.replace(/[:.]/g, "-");
  const prefix = `exports/${identityId}/migration/${stamp}`;
  const dir = await mkdtemp(join(tmpdir(), "migration-export-"));
  const path = join(dir, "export.zip");

  await putJson(`${prefix}.running.json`, { startedAt: exportedAt });
  try {
    await writeArchive(owner, identityId, exportedAt, path);
    await putFile(`${prefix}.zip`, path, "application/zip");
  } catch (error) {
    console.error("Migration export failed", error);
    await putJson(`${prefix}.error.json`, {
      startedAt: exportedAt,
      failedAt: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await deleteObject(`${prefix}.running.json`);
    await rm(dir, { recursive: true, force: true });
  }
};
