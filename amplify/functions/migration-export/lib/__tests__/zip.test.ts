import { execFileSync } from "child_process";
import { randomBytes } from "crypto";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterAll, describe, expect, it } from "vitest";
import { ZipFileWriter } from "../zip";

const hasUnzip = (() => {
  try {
    execFileSync("unzip", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe.skipIf(!hasUnzip)("ZipFileWriter", () => {
  const dir = mkdtempSync(join(tmpdir(), "zip-test-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("writes an archive that unzip verifies and reads back", async () => {
    const path = join(dir, "test.zip");
    const json = Buffer.from(
      JSON.stringify({ text: "äöü ".repeat(500) }),
      "utf8"
    );
    const binary = randomBytes(64 * 1024);
    const zip = await ZipFileWriter.create(path);
    await zip.add("data/people.json", json);
    await zip.add("files/abc", binary, { compress: false });
    await zip.add("empty.json", Buffer.alloc(0));
    await zip.finish();

    expect(execFileSync("unzip", ["-t", path]).toString()).toContain(
      "No errors detected"
    );
    expect(execFileSync("unzip", ["-p", path, "data/people.json"])).toEqual(
      json
    );
    expect(execFileSync("unzip", ["-p", path, "files/abc"])).toEqual(binary);
    expect(
      execFileSync("unzip", ["-Z1", path]).toString().trim().split("\n")
    ).toEqual(["data/people.json", "files/abc", "empty.json"]);
  });
});
