/**
 * Tests for getProjectMd function
 * Run with: npm test projects.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { getProjectMd } from "../projects";
import type { ExportTask } from "../load-task-record";
import * as fetching from "../../fetching";
import mockProject from "../../fetching/__tests__/mock_project.json";

// Mock the fetching functions
vi.mock("../../fetching", () => ({
  fetchingProject: vi.fn(),
}));

// Mock getPerson from people helper with multiple people
vi.mock("../people", () => ({
  getPerson: vi.fn((personId: string) => {
    const people: Record<string, string> = {
      "56cabd7e-584c-4669-a0ad-619d18c8c7ab":
        "Elena Rossi (Operations Lead at ACME Corporation)",
      "920a3de4-a265-4c72-8201-1466dc21d879":
        "Michael Adams (Industrial IoT Architect at IT Corp.)",
      "e4c62387-b6e9-4e1e-94fa-4c3ccbf12312":
        "Carsten (Account Manager at IT Corp.)",
      "72e3f25f-934c-4d57-a105-6a8e01558aac":
        "Tobias Richter (Network Engineer at ACME Corporation)",
      "64aa99bf-e3f3-4778-9313-498e4d5673e0":
        "Dragan Petrovic (Factory IT Manager at ACME Corporation)",
    };
    return Promise.resolve(people[personId] || "Unknown Person");
  }),
  getPeopleFromCache: vi.fn((ids: string[]) => ({
    people: [],
    remainingIds: ids,
  })),
}));

describe("getProjectMd", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    vi.mocked(fetching.fetchingProject).mockResolvedValue(mockProject as any);
  });

  it("should generate expected markdown output", async () => {
    const task: ExportTask = {
      id: "test-task-1",
      owner: "test-owner",
      dataSource: "project",
      itemId: mockProject.id,
      itemName: mockProject.project,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-30"),
    };

    const result = await getProjectMd(task);

    // Read expected result from file
    const expectedResult = readFileSync(
      join(__dirname, "get-project-md.result.md"),
      "utf-8"
    );

    expect(result).toBe(expectedResult);
  });
});
