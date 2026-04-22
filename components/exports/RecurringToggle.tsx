import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FC } from "react";

interface RecurringToggleProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
}

export const RecurringToggle: FC<RecurringToggleProps> = ({
  isRecurring,
  setIsRecurring,
}) => (
  <div className="flex items-center justify-between rounded-lg border p-3">
    <div className="space-y-0.5">
      <Label htmlFor="recurring-toggle">Recurring Export</Label>
      <p className="text-sm text-muted-foreground">
        Automatically export data on a schedule
      </p>
    </div>
    <Switch
      id="recurring-toggle"
      checked={isRecurring}
      onCheckedChange={setIsRecurring}
    />
  </div>
);
