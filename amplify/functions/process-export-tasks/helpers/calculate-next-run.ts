import {
  addDays,
  addMonths,
  setHours,
  setMinutes,
  setDate,
  setSeconds,
  setMilliseconds,
} from "date-fns";

export interface RecurringExportSchedule {
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number; // 0-6 for weekly (0=Sunday)
  dayOfMonth?: number; // 1-31 for monthly
  timeOfDay: string; // HH:MM in UTC
}

/**
 * Calculate the next run time for a recurring export
 */
export function calculateNextRun(
  schedule: RecurringExportSchedule,
  from: Date = new Date()
): Date {
  const { frequency, dayOfWeek, dayOfMonth, timeOfDay } = schedule;
  const [hours, minutes] = timeOfDay.split(":").map(Number);

  // Normalize the "from" date to the specified time
  let next = setMilliseconds(
    setSeconds(setMinutes(setHours(from, hours), minutes), 0),
    0
  );

  // If the calculated time is in the past or within the next minute, move to next period
  if (next <= from) {
    next = addDays(next, 1);
  }

  switch (frequency) {
    case "daily":
      // Already handled above - next occurrence is tomorrow at the specified time
      return next;

    case "weekly": {
      if (dayOfWeek === undefined) {
        throw new Error("dayOfWeek is required for weekly recurrence");
      }
      // Find the next occurrence of the specified day of week
      while (next.getDay() !== dayOfWeek) {
        next = addDays(next, 1);
      }
      return next;
    }

    case "monthly": {
      if (dayOfMonth === undefined) {
        throw new Error("dayOfMonth is required for monthly recurrence");
      }

      // Get the last valid day of the current month
      const lastDayOfMonth = new Date(
        next.getFullYear(),
        next.getMonth() + 1,
        0
      ).getDate();

      // Use the requested day or the last day if it doesn't exist (e.g., Feb 30 -> Feb 28/29)
      const validDay = Math.min(dayOfMonth, lastDayOfMonth);
      next = setDate(next, validDay);

      // If we've already passed this day this month, move to next month
      if (next <= from) {
        next = addMonths(next, 1);

        // Recalculate valid day for the next month
        const nextMonthLastDay = new Date(
          next.getFullYear(),
          next.getMonth() + 1,
          0
        ).getDate();
        const nextValidDay = Math.min(dayOfMonth, nextMonthLastDay);
        next = setDate(next, nextValidDay);
      }

      return next;
    }

    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}
