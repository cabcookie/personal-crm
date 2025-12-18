/**
 * Tests for getAccountMd function
 * Run with: npm test accounts.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { getAccountMd } from "../accounts";
import type { ExportTask } from "../load-task-record";
import * as fetching from "../../fetching";
import mockAccount from "../../fetching/__tests__/mock_account.json";
import mockProject from "../../fetching/__tests__/mock_project.json";

// Mock the fetching functions
vi.mock("../../fetching", () => ({
  fetchingAccount: vi.fn(),
  fetchingProject: vi.fn(),
}));

// Mock getPerson from people helper
vi.mock("../people", () => ({
  getPerson: vi.fn((personId: string) => {
    if (personId === "56cabd7e-584c-4669-a0ad-619d18c8c7ab") {
      return Promise.resolve(
        "Elena Rossi (Operations Lead at ACME Corporation)"
      );
    }
    return Promise.resolve("Unknown Person");
  }),
  getPeopleFromCache: vi.fn((ids: string[]) => ({
    people: [],
    remainingIds: ids,
  })),
}));

describe("getAccountMd", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(fetching.fetchingAccount).mockResolvedValue(mockAccount as any);
    vi.mocked(fetching.fetchingProject).mockResolvedValue(mockProject as any);
  });

  it("should generate expected markdown output", async () => {
    const task: ExportTask = {
      id: "test-task-1",
      owner: "test-owner",
      dataSource: "account",
      itemId: mockAccount.id,
      itemName: mockAccount.name,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-12-31"),
    };

    const result = await getAccountMd(task);

    // Read expected result from file
    const expectedResult = readFileSync(
      join(__dirname, "get-account-md.result.md"),
      "utf-8"
    );

    expect(result).toBe(expectedResult);
  });
});
