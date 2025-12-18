import { FC, useState, ReactNode } from "react";
import type { Schema } from "@/amplify/data/resource";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  useRecurringExports,
  type RecurrenceFrequency,
} from "@/api/useRecurringExports";
import { ExportDialogHeader } from "./ExportDialogHeader";
import { ExportDialogFooter } from "./ExportDialogFooter";
import { DaysToInclude } from "./DaysToInclude";
import { ExportSummary } from "./ExportSummary";

export const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

interface RecurringExportFormProps {
  onClose: () => void;
  dataSource: Schema["ExportTaskDataSource"]["type"];
  itemId: string;
  itemName: string;
  resetRecurringToggle: () => void;
  toggleComponent: ReactNode;
  presets?: number[]; // Days to go back (e.g., [7, 14, 28])
}

export const RecurringExportForm: FC<RecurringExportFormProps> = ({
  onClose,
  dataSource,
  itemId,
  itemName,
  resetRecurringToggle,
  toggleComponent,
  presets,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState(`${itemName} Weekly Export`);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("weekly");
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // Monday
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [daysToInclude, setDaysToInclude] = useState(7);

  const { createRecurringExport } = useRecurringExports("active");

  const resetForm = () => {
    setName("");
    setFrequency("weekly");
    setDayOfWeek(1);
    setDayOfMonth(1);
    setTimeOfDay("09:00");
    setDaysToInclude(7);
    resetRecurringToggle();
  };

  const handleCreateRecurringExport = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the recurring export",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const result = await createRecurringExport({
        name: name.trim(),
        dataSource,
        itemId,
        itemName,
        frequency,
        dayOfWeek: frequency === "weekly" ? dayOfWeek : undefined,
        dayOfMonth: frequency === "monthly" ? dayOfMonth : undefined,
        timeOfDay,
        daysToInclude,
      });

      if (!result) return;

      toast({
        title: "Recurring export created",
        description: `Export will run ${frequency} and include the last ${daysToInclude} days of data.`,
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating recurring export:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <>
      <ExportDialogHeader {...{ dataSource, itemName }} />

      <div className="space-y-4 py-4">
        {toggleComponent}

        <div className="space-y-2">
          <Label htmlFor="export-name">Export Name</Label>
          <Input
            id="export-name"
            placeholder="Enter name for recurring export"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as RecurrenceFrequency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select
                value={String(dayOfWeek)}
                onValueChange={(v) => setDayOfWeek(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "monthly" && (
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Select
                value={String(dayOfMonth)}
                onValueChange={(v) => setDayOfMonth(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {frequency === "daily" && <div />}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time-of-day">Time (UTC)</Label>
            <Input
              id="time-of-day"
              type="time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
            />
          </div>

          <DaysToInclude {...{ daysToInclude, setDaysToInclude, presets }} />
        </div>

        <ExportSummary
          {...{ frequency, dayOfWeek, dayOfMonth, timeOfDay, daysToInclude }}
        />
      </div>

      <ExportDialogFooter
        isCreating={isCreating}
        btnLabel="Create Recurring Export"
        isValid={isValid}
        onClose={onClose}
        onClick={handleCreateRecurringExport}
      />
    </>
  );
};
