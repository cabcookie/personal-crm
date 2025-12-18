import { format } from "date-fns";
import { FC } from "react";
import { DAYS_OF_WEEK } from "./RecurringExportForm";

interface ExportSummaryProps {
  startDate?: Date;
  endDate?: Date;
  frequency?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timeOfDay?: string;
  daysToInclude?: number;
}

export const ExportSummary: FC<ExportSummaryProps> = ({
  startDate,
  endDate,
  frequency,
  dayOfWeek,
  dayOfMonth,
  timeOfDay,
  daysToInclude,
}) =>
  ((startDate && endDate) || frequency) && (
    <div className="rounded-md bg-muted p-3 text-sm">
      {startDate && endDate && (
        <>
          Exporting data from <strong>{format(startDate, "PPP")}</strong> to{" "}
          <strong>{format(endDate, "PPP")}</strong>
        </>
      )}
      {frequency && (
        <>
          Export will run <strong>{frequency}</strong>
          {frequency === "weekly" &&
            ` on ${DAYS_OF_WEEK.find((d) => d.value === String(dayOfWeek))?.label}`}
          {frequency === "monthly" && ` on day ${dayOfMonth}`} at{" "}
          <strong>{timeOfDay} UTC</strong>, including the last{" "}
          <strong>{daysToInclude} days</strong> of data.
        </>
      )}
    </div>
  );
