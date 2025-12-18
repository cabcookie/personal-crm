import { FC } from "react";
import { DatePicker } from "./DatePicker";
import { ExportSummary } from "./ExportSummary";

interface DateRangePickerProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <DatePicker
        label="Start Date"
        date={startDate}
        setDate={setStartDate}
        disabled={(date) =>
          date > new Date() || (endDate ? date > endDate : false)
        }
      />
      <DatePicker
        label="End Date"
        date={endDate}
        setDate={setEndDate}
        disabled={(date) =>
          date > new Date() || (startDate ? date < startDate : false)
        }
      />
    </div>

    <ExportSummary {...{ startDate, endDate }} />
  </>
);
