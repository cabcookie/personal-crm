/**
 * Turns the objects under `exports/<identityId>/migration/` into the list of
 * migration exports shown in the settings. The migration-export Lambda writes
 * `<stamp>.running.json` while it runs, then either `<stamp>.zip` or
 * `<stamp>.error.json` (see docs/migration-export-format.md).
 */

export type MigrationExportStatus = "running" | "aborted" | "done" | "failed";

export type MigrationExport = {
  stamp: string;
  startedAt: Date;
  status: MigrationExportStatus;
  /** S3 path of the ZIP (done) or the error marker (failed). */
  path: string | null;
  size: number | null;
};

export type StorageItem = {
  path: string;
  size?: number;
  lastModified?: Date;
};

/** The Lambda times out after 15 minutes; a marker older than that is stale. */
export const RUNNING_TIMEOUT_MS = 16 * 60 * 1000;

const FILE = /\/([^/]+)\.(zip|error\.json|running\.json)$/;

/** `2026-10-10T18-30-00-123Z` -> `2026-10-10T18:30:00.123Z` */
export const stampToDate = (stamp: string): Date =>
  new Date(stamp.replace(/T(\d\d)-(\d\d)-(\d\d)-(\d{3})Z$/, "T$1:$2:$3.$4Z"));

export const parseMigrationExports = (
  items: StorageItem[],
  now: Date
): MigrationExport[] => {
  const byStamp = new Map<
    string,
    { zip?: StorageItem; error?: StorageItem; running?: StorageItem }
  >();
  for (const item of items) {
    const match = item.path.match(FILE);
    if (!match) continue;
    const [, stamp, kind] = match;
    const entry = byStamp.get(stamp) ?? {};
    if (kind === "zip") entry.zip = item;
    else if (kind === "error.json") entry.error = item;
    else entry.running = item;
    byStamp.set(stamp, entry);
  }
  return [...byStamp.entries()]
    .map(([stamp, { zip, error, running }]): MigrationExport => {
      const startedAt = stampToDate(stamp);
      if (zip)
        return {
          stamp,
          startedAt,
          status: "done",
          path: zip.path,
          size: zip.size ?? null,
        };
      if (error)
        return {
          stamp,
          startedAt,
          status: "failed",
          path: error.path,
          size: null,
        };
      const since = running?.lastModified ?? startedAt;
      return {
        stamp,
        startedAt,
        status:
          now.getTime() - since.getTime() > RUNNING_TIMEOUT_MS
            ? "aborted"
            : "running",
        path: null,
        size: null,
      };
    })
    .sort((a, b) => b.stamp.localeCompare(a.stamp));
};
