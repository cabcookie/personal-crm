import { FC, useState, ReactNode } from "react";
import { subDays } from "date-fns";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ExportDialogFooter } from "./ExportDialogFooter";
import { ExportDialogHeader } from "./ExportDialogHeader";
import { DateRangePicker } from "./DateRangePicker";
import { handleApiErrors } from "@/api/globals";

const client = generateClient<Schema>();

interface OneTimeExportFormProps {
  onClose: () => void;
  dataSource: Schema["ExportTaskDataSource"]["type"];
  itemId: string;
  itemName: string;
  resetRecurringToggle: () => void;
  toggleComponent: ReactNode;
  presets?: number[]; // Days to go back (e.g., [7, 14, 28])
}

export const OneTimeExportForm: FC<OneTimeExportFormProps> = ({
  onClose,
  dataSource,
  itemId,
  itemName,
  resetRecurringToggle,
  toggleComponent,
  presets = [7, 14, 28],
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isCreating, setIsCreating] = useState(false);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = subDays(end, days);
    setStartDate(start);
    setEndDate(end);
  };

  const resetForm = () => {
    setStartDate(undefined);
    setEndDate(new Date());
    resetRecurringToggle();
  };

  const handleCreateOneTimeExport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date range required",
        description: "Please select a start and end date",
        variant: "destructive",
      });
      return;
    }

    if (startDate > endDate) {
      toast({
        title: "Invalid date range",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    // Calculate TTL: current time + 7 days (in seconds)
    const ttl = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    const { errors } = await client.models.ExportTask.create({
      dataSource,
      itemId,
      itemName,
      status: "CREATED",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ttl,
    });

    if (errors) {
      handleApiErrors(errors, "Failed creating export task");
      return;
    }

    toast({
      title: "Export started",
      description: "You'll be notified when the export is ready.",
    });

    onClose();
    resetForm();
    setIsCreating(false);
  };

  const isValid = Boolean(startDate && endDate);

  return (
    <>
      <ExportDialogHeader {...{ dataSource, itemName }} />

      <div className="space-y-4 py-4">
        {toggleComponent}

        <div className="space-y-2">
          <Label>Quick Select</Label>
          <div className="flex gap-2">
            {presets.map((days) => (
              <Button
                key={days}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(days)}
              >
                Last {days} days
              </Button>
            ))}
          </div>
        </div>

        <DateRangePicker
          {...{ startDate, setStartDate, endDate, setEndDate }}
        />
      </div>

      <ExportDialogFooter
        isCreating={isCreating}
        btnLabel="Start Export"
        isValid={isValid}
        onClose={onClose}
        onClick={handleCreateOneTimeExport}
      />
    </>
  );
};
