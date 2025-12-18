import { FC } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExportDialogHeaderProps {
  dataSource: string;
  itemName: string;
}

export const ExportDialogHeader: FC<ExportDialogHeaderProps> = ({
  dataSource,
  itemName,
}) => (
  <DialogHeader>
    <DialogTitle>
      Export {dataSource.charAt(0).toUpperCase() + dataSource.slice(1)} Data
    </DialogTitle>
    <DialogDescription>
      Select a date range to export data for <strong>{itemName}</strong>
    </DialogDescription>
  </DialogHeader>
);
