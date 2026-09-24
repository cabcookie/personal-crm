/**
 * Tests for renderProject's summary section (account-export path).
 *
 * The AI project summary is included as a `## Summary`-style section (one level
 * below the project heading), before the notes, and a project with ONLY a
 * summary (no in-window activities) still renders.
 *
 * Run with: npm test
 */
import { describe, it, expect } from "vitest";
import { renderProject, type ProjectRecord } from "../projects";

const base: ProjectRecord = {
  id: "p1",
  project: "Landing Zone für ALDI",
};

describe("renderProject summary section", () => {
  it("renders the summary one level below the project heading, before notes", () => {
    const md = renderProject(
      { ...base, projectSummary: "This is the overall goal of the project." },
      3
    );
    expect(md).toContain("### Project: Landing Zone für ALDI");
    expect(md).toContain("#### Summary");
    expect(md).toContain("This is the overall goal of the project.");
    // Summary heading nests exactly one level under the project heading.
    const projIdx = md.indexOf("### Project:");
    const sumIdx = md.indexOf("#### Summary");
    expect(projIdx).toBeGreaterThanOrEqual(0);
    expect(sumIdx).toBeGreaterThan(projIdx);
  });

  it("renders a summary-only project (no activities)", () => {
    const md = renderProject(
      { ...base, projectSummary: "Overall context." },
      3
    );
    expect(md).not.toBe("");
    expect(md).toContain("#### Summary");
    expect(md).toContain("Overall context.");
  });

  it("omits the summary section when there is no summary", () => {
    const md = renderProject({ ...base, projectSummary: "   " }, 3);
    // No summary and no activities/meta → nothing worth rendering.
    expect(md).toBe("");
  });

  it("keeps the summary above the notes when both exist", () => {
    const md = renderProject(
      {
        ...base,
        projectSummary: "SUMMARY_MARKER",
        activities: [
          {
            id: "a1",
            finishedOn: "2026-09-15T10:00:00Z",
            notes: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "NOTE_MARKER" }],
                },
              ],
            }),
          } as never,
        ],
      },
      3
    );
    const sumIdx = md.indexOf("SUMMARY_MARKER");
    const noteIdx = md.indexOf("NOTE_MARKER");
    expect(sumIdx).toBeGreaterThanOrEqual(0);
    if (noteIdx >= 0) expect(sumIdx).toBeLessThan(noteIdx);
  });
});
