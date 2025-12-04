import { FC, useState } from "react";
import { subDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const client = generateClient<Schema>();

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: "account" | "project" | "person";
  itemId: string;
  itemName: string;
  presets?: number[]; // Days to go back (e.g., [7, 14, 28])
}

export const ExportDialog: FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  dataSource,
  itemId,
  itemName,
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

  const handleStartExport = async () => {
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

    try {
      // Calculate TTL: current time + 7 days (in seconds)
      const ttl = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

      const { data, errors } = await client.models.ExportTask.create({
        dataSource,
        itemId,
        itemName,
        status: "CREATED",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ttl,
      });

      if (errors && errors.length > 0)
        throw new Error(
          `GraphQL Error: ${errors.map((err) => `${err.errorType}: ${err.message}`).join(", ")}`
        );
      if (errors) throw errors;
      if (!data)
        throw new Error(
          "No data returned. Confirmation should return the created record."
        );

      toast({
        title: "Export started",
        description: "You'll be notified when the export is ready.",
      });

      onClose();
      // Reset form
      setStartDate(undefined);
      setEndDate(new Date());
    } catch (error) {
      console.error("Error creating export task:", error);
      toast({
        title: "Export failed",
        description:
          error instanceof Error ? error.message : "Failed to create export",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Export {dataSource.charAt(0).toUpperCase() + dataSource.slice(1)}{" "}
            Data
          </DialogTitle>
          <DialogDescription>
            Select a date range to export data for <strong>{itemName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Select</label>
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

          {/* Date Range Pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date > new Date() || (endDate ? date > endDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date > new Date() ||
                      (startDate ? date < startDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Date Range Summary */}
          {startDate && endDate && (
            <div className="rounded-md bg-muted p-3 text-sm">
              Exporting data from <strong>{format(startDate, "PPP")}</strong> to{" "}
              <strong>{format(endDate, "PPP")}</strong>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleStartExport}
            disabled={!startDate || !endDate || isCreating}
          >
            {isCreating ? "Creating..." : "Start Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
