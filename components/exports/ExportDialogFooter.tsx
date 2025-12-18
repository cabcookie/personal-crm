import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ExportDialogFooterProps {
  isCreating: boolean;
  btnLabel: string;
  isValid?: boolean;
  onClose: () => void;
  onClick: () => void;
}

export const ExportDialogFooter: FC<ExportDialogFooterProps> = ({
  isCreating,
  btnLabel,
  onClose,
  onClick,
  isValid,
}) => (
  <DialogFooter>
    <Button variant="outline" onClick={onClose} disabled={isCreating}>
      Cancel
    </Button>
    <Button onClick={onClick} disabled={!isValid || isCreating}>
      {isCreating ? "Creating..." : btnLabel}
    </Button>
  </DialogFooter>
);
