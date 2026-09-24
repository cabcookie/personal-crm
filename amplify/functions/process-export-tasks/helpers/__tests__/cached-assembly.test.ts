/**
 * Tests for assembleProjectFromCache's date-window filtering.
 *
 * Regression guard: the project export (getProjectMd) must only include
 * activities whose effective date falls inside the export's [startDate,
 * endDate] window. A bug shipped where no window was passed, so a "last 28
 * days" export returned the project's entire history.
 *
 * Run with: npm test
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DynamoDB access layer so the assembler runs against in-memory data.
vi.mock("../dynamodb", () => ({
  queryByIndex: vi.fn(),
  batchGetItems: vi.fn(),
  getItem: vi.fn(),
}));

import { assembleProjectFromCache } from "../cached-assembly";
import { queryByIndex, batchGetItems } from "../dynamodb";

const asMap = <T>(items: Array<T & { id: string }>): Map<string, T> =>
  new Map(items.map((it) => [it.id, it]));

const PROJECT_ID = "proj-1";
const OWNER = "sub::sub";

// Three activities, each linked to a meeting on a distinct date.
const activities = [
  {
    id: "act-recent",
    notesMarkdown: "Recent note body",
    meetingActivitiesId: "m-recent",
  },
  {
    id: "act-old",
    notesMarkdown: "Old note body",
    meetingActivitiesId: "m-old",
  },
  {
    id: "act-ancient",
    notesMarkdown: "Ancient note body",
    meetingActivitiesId: "m-ancient",
  },
];

const meetings = [
  {
    id: "m-recent",
    meetingOn: "2026-09-15T10:00:00Z",
    meetingHeaderMarkdown: "Recent meeting",
  },
  {
    id: "m-old",
    meetingOn: "2026-06-09T10:00:00Z",
    meetingHeaderMarkdown: "Old meeting",
  },
  {
    id: "m-ancient",
    meetingOn: "2026-06-05T10:00:00Z",
    meetingHeaderMarkdown: "Ancient meeting",
  },
];

beforeEach(() => {
  vi.mocked(queryByIndex).mockReset();
  vi.mocked(batchGetItems).mockReset();

  // ProjectActivity junctions for the project.
  vi.mocked(queryByIndex).mockResolvedValue(
    activities.map((a) => ({ activityId: a.id })) as never
  );

  // batchGetItems is called for Activity then Meeting; route by table name.
  vi.mocked(batchGetItems).mockImplementation((async (table: string) => {
    if (table === "Activity") return asMap(activities);
    if (table === "Meeting") return asMap(meetings);
    return new Map();
  }) as never);
});

describe("assembleProjectFromCache date window", () => {
  it("includes only activities inside [startDate, endDate]", async () => {
    // 28-day window ending 2026-09-21 → only the 2026-09-15 activity qualifies.
    const md = await assembleProjectFromCache(PROJECT_ID, { owner: OWNER }, 2, {
      startDate: new Date("2026-08-24T00:00:00Z"),
      endDate: new Date("2026-09-21T00:00:00Z"),
    });

    expect(md).toContain("Recent note body");
    expect(md).not.toContain("Old note body");
    expect(md).not.toContain("Ancient note body");
  });

  it("includes all activities when no window is given", async () => {
    const md = await assembleProjectFromCache(PROJECT_ID, { owner: OWNER }, 2);

    expect(md).toContain("Recent note body");
    expect(md).toContain("Old note body");
    expect(md).toContain("Ancient note body");
  });

  it("treats the end day as inclusive (whole calendar day)", async () => {
    // Window whose end IS the recent activity's day, at 00:00 — the activity is
    // later that day (10:00) and must still be included.
    const md = await assembleProjectFromCache(PROJECT_ID, { owner: OWNER }, 2, {
      startDate: new Date("2026-09-15T00:00:00Z"),
      endDate: new Date("2026-09-15T00:00:00Z"),
    });

    expect(md).toContain("Recent note body");
    expect(md).not.toContain("Old note body");
  });

  it("returns empty string when nothing falls in the window", async () => {
    const md = await assembleProjectFromCache(PROJECT_ID, { owner: OWNER }, 2, {
      startDate: new Date("2020-01-01T00:00:00Z"),
      endDate: new Date("2020-12-31T00:00:00Z"),
    });

    expect(md).toBe("");
  });
});
