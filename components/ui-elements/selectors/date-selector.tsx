import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toLocaleTimeString } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";

type DateSelectorProps = {
  elementId?: string;
  selectHours?: boolean;
  date?: Date;
  setDate: (date: Date) => void;
  placeholder?: string;
  bold?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  captionLayout?: CalendarProps["captionLayout"];
};

const DateSelector: FC<DateSelectorProps> = ({
  elementId,
  date,
  setDate,
  selectHours,
  bold,
  disabled,
  isLoading,
  startMonth,
  endMonth,
  captionLayout,
  placeholder = "Pick a date…",
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [time, setTime] = useState(date);
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setTime(date);
    setSelectedDate(date);
  }, [date]);

  const getCombinedDate = (d: Date | undefined, t: Date | string | undefined) =>
    d &&
    (!t
      ? new Date(d.getFullYear(), d.getMonth(), d.getDate())
      : new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          typeof t === "string" ? parseInt(t.substring(0, 2)) : t.getHours(),
          typeof t === "string" ? parseInt(t.substring(3, 5)) : t.getMinutes()
        ));

  const onDateChange = (d: Date | undefined) => {
    const newDate = getCombinedDate(d, time);
    if (!newDate) return;
    setCalendarOpen(false);
    setSelectedDate(newDate);
    setDate(newDate);
  };

  const onTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = getCombinedDate(selectedDate, event.target.value);
    if (!newDate) return;
    setTime(newDate);
    setDate(newDate);
  };

  return (
    <div id={elementId} className="flex flex-row gap-2">
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled || isLoading}
            variant="outline"
            className={cn(
              "w-[240px] pl-3 text-left",
              bold ? "font-semibold" : "font-normalize",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
            {!isLoading && (
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            )}
            {isLoading && (
              <Loader2 className="ml-auto h-4 w-4 opacity-50 animate-spin" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            defaultMonth={selectedDate}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </PopoverContent>
      </Popover>

      {selectHours && (
        <input
          className={cn(
            "border-solid border rounded-md px-4 py-2 text-sm h-10",
            bold && "font-semibold"
          )}
          type="time"
          value={toLocaleTimeString(time)}
          onChange={onTimeChange}
        />
      )}
    </div>
  );
};

export default DateSelector;
