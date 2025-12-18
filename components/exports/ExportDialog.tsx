import { FC, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RecurringToggle } from "./RecurringToggle";
import { OneTimeExportForm } from "./OneTimeExportForm";
import { RecurringExportForm } from "./RecurringExportForm";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: Schema["ExportTaskDataSource"]["type"];
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
  presets,
}) => {
  const [isRecurring, setIsRecurring] = useState(false);

  const resetRecurringToggle = () => setIsRecurring(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isRecurring ? (
          <RecurringExportForm
            {...{
              onClose,
              dataSource,
              itemId,
              itemName,
              resetRecurringToggle,
              presets,
              toggleComponent: (
                <RecurringToggle {...{ isRecurring, setIsRecurring }} />
              ),
            }}
          />
        ) : (
          <OneTimeExportForm
            {...{
              onClose,
              dataSource,
              itemId,
              itemName,
              resetRecurringToggle,
              toggleComponent: (
                <RecurringToggle {...{ isRecurring, setIsRecurring }} />
              ),
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
