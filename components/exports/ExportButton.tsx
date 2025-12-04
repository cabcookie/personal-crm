import { FC, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./ExportDialog";

interface ExportButtonProps {
  dataSource: "account" | "project" | "person";
  itemId: string;
  itemName: string;
  presets?: number[]; // Days to go back (e.g., [7, 14, 28])
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ExportButton: FC<ExportButtonProps> = ({
  dataSource,
  itemId,
  itemName,
  presets,
  variant = "outline",
  size = "sm",
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
      >
        <Download className="mr-2 h-4 w-4" />
        Export for AI
      </Button>

      <ExportDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        {...{ dataSource, itemId, itemName, presets }}
      />
    </>
  );
};
