import { describe, expect, it } from "vitest";
import {
  parseMigrationExports,
  RUNNING_TIMEOUT_MS,
  stampToDate,
} from "../migration-exports";

const dir = "exports/eu-central-1:abc/migration/";
const now = new Date("2026-10-10T20:00:00.000Z");

describe("stampToDate", () => {
  it("restores the ISO timestamp from the file stamp", () => {
    expect(stampToDate("2026-10-10T18-30-05-123Z").toISOString()).toBe(
      "2026-10-10T18:30:05.123Z"
    );
  });
});

describe("parseMigrationExports", () => {
  it("derives status per stamp, newest first", () => {
    const result = parseMigrationExports(
      [
        { path: `${dir}2026-10-08T10-00-00-000Z.zip`, size: 1234 },
        { path: `${dir}2026-10-09T10-00-00-000Z.error.json` },
        {
          path: `${dir}2026-10-10T19-55-00-000Z.running.json`,
          lastModified: new Date("2026-10-10T19:55:01.000Z"),
        },
        { path: `${dir}unrelated.txt` },
      ],
      now
    );
    expect(result.map((e) => [e.stamp, e.status, e.path, e.size])).toEqual([
      ["2026-10-10T19-55-00-000Z", "running", null, null],
      [
        "2026-10-09T10-00-00-000Z",
        "failed",
        `${dir}2026-10-09T10-00-00-000Z.error.json`,
        null,
      ],
      [
        "2026-10-08T10-00-00-000Z",
        "done",
        `${dir}2026-10-08T10-00-00-000Z.zip`,
        1234,
      ],
    ]);
  });

  it("treats a stale running marker as aborted", () => {
    const started = new Date(now.getTime() - RUNNING_TIMEOUT_MS - 1000);
    const [entry] = parseMigrationExports(
      [{ path: `${dir}x.running.json`, lastModified: started }],
      now
    );
    expect(entry.status).toBe("aborted");
  });

  it("prefers the archive over leftover markers", () => {
    const [entry] = parseMigrationExports(
      [
        { path: `${dir}s.running.json`, lastModified: now },
        { path: `${dir}s.zip`, size: 1 },
      ],
      now
    );
    expect(entry.status).toBe("done");
  });
});
