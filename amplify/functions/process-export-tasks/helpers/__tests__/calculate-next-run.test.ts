/**
 * Test file for calculateNextRun function
 * Run with: npm test
 */

import { describe, it, expect } from "vitest";
import {
  calculateNextRun,
  RecurringExportSchedule,
} from "../calculate-next-run";
import { format } from "date-fns";

describe("calculateNextRun", () => {
  describe("Daily Recurrence", () => {
    it("should schedule same day if time is in future", () => {
      const now = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "daily",
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-15 14:00");
    });

    it("should schedule next day if time already passed", () => {
      const now = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "daily",
        timeOfDay: "09:00",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-16 09:00");
    });
  });

  describe("Weekly Recurrence", () => {
    it("should schedule same weekday if time is in future", () => {
      const monday = new Date("2024-01-15T10:00:00Z"); // Monday
      const schedule: RecurringExportSchedule = {
        frequency: "weekly",
        dayOfWeek: 1, // Monday
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, monday);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-15 14:00");
    });

    it("should find next occurrence of target weekday (Monday to Friday)", () => {
      const monday = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "weekly",
        dayOfWeek: 5, // Friday
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, monday);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-19 14:00");
    });

    it("should wrap to next week for Sunday from Monday", () => {
      const monday = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "weekly",
        dayOfWeek: 0, // Sunday
        timeOfDay: "09:00",
      };

      const next = calculateNextRun(schedule, monday);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-21 09:00");
    });

    it("should throw error if dayOfWeek is missing", () => {
      const schedule: RecurringExportSchedule = {
        frequency: "weekly",
        timeOfDay: "14:00",
      };

      expect(() => calculateNextRun(schedule)).toThrow(
        "dayOfWeek is required for weekly recurrence"
      );
    });
  });

  describe("Monthly Recurrence", () => {
    it("should schedule same month for day 15", () => {
      const now = new Date("2024-01-10T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 15,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-15 14:00");
    });

    it("should move to next month when day already passed", () => {
      const now = new Date("2024-01-20T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 15,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-02-15 14:00");
    });

    it("should throw error if dayOfMonth is missing", () => {
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        timeOfDay: "14:00",
      };

      expect(() => calculateNextRun(schedule)).toThrow(
        "dayOfMonth is required for monthly recurrence"
      );
    });
  });

  describe("Monthly Edge Cases", () => {
    it("should clamp day 31 to Feb 29 in leap year", () => {
      const febStart = new Date("2024-02-01T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 31,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, febStart);
      expect(format(next, "yyyy-MM-dd")).toBe("2024-02-29");
    });

    it("should clamp day 31 to Apr 30", () => {
      const aprStart = new Date("2024-04-01T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 31,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, aprStart);
      expect(format(next, "yyyy-MM-dd")).toBe("2024-04-30");
    });

    it("should clamp day 30 to Feb 29 in leap year", () => {
      const febStart = new Date("2024-02-01T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 30,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, febStart);
      expect(format(next, "yyyy-MM-dd")).toBe("2024-02-29");
    });

    it("should clamp day 29 to Feb 28 in non-leap year", () => {
      const feb2023 = new Date("2023-02-01T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 29,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, feb2023);
      expect(format(next, "yyyy-MM-dd")).toBe("2023-02-28");
    });

    it("should handle transition from Jan 31 to Feb in leap year", () => {
      const jan31 = new Date("2024-01-31T15:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 31,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, jan31);
      expect(format(next, "yyyy-MM-dd")).toBe("2024-02-29");
    });

    it("should handle day 31 transition from May to June", () => {
      const may31 = new Date("2024-05-31T15:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "monthly",
        dayOfMonth: 31,
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, may31);
      expect(format(next, "yyyy-MM-dd")).toBe("2024-06-30");
    });
  });

  describe("Time of Day Handling", () => {
    it("should move to next day at exact scheduled time", () => {
      const now = new Date("2024-01-15T14:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "daily",
        timeOfDay: "14:00",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-16 14:00");
    });

    it("should handle late evening time (23:59)", () => {
      const now = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "daily",
        timeOfDay: "23:59",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-15 23:59");
    });

    it("should handle early morning time (00:30)", () => {
      const now = new Date("2024-01-15T10:00:00Z");
      const schedule: RecurringExportSchedule = {
        frequency: "daily",
        timeOfDay: "00:30",
      };

      const next = calculateNextRun(schedule, now);
      expect(format(next, "yyyy-MM-dd HH:mm")).toBe("2024-01-16 00:30");
    });
  });
});
