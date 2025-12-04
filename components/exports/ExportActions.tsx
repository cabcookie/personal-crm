import { FC } from "react";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  copyToClipboard,
  downloadMarkdown,
} from "@/helpers/exports/markdown-actions";
import { toast } from "@/components/ui/use-toast";
import { useExports } from "@/api/useExports";

interface ExportActionsProps {
  taskId: string;
  result: string;
  itemName: string;
  dataSource: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showLabels?: boolean;
}

export const ExportActions: FC<ExportActionsProps> = ({
  taskId,
  result,
  itemName,
  dataSource,
  variant = "default",
  size = "sm",
  showLabels = true,
}) => {
  const { markExportCompleted } = useExports();

  const handleCopy = async () => {
    const success = await copyToClipboard(result, itemName);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Export data copied successfully",
      });
      await markExportCompleted(taskId);
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      downloadMarkdown(result, itemName, dataSource);
      toast({
        title: "Download started",
        description: "Export file is downloading",
      });
      await markExportCompleted(taskId);
    } catch (error) {
      toast({
        title: "Download failed",
        description: `Failed to download export: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant={variant} size={size} onClick={handleDownload}>
        <Download className={showLabels ? "mr-2 size-4" : "size-4"} />
        {showLabels && "Download"}
      </Button>
      <Button
        variant={variant === "default" ? "outline" : variant}
        size={size}
        onClick={handleCopy}
      >
        <Copy className={showLabels ? "mr-2 size-4" : "size-4"} />
        {showLabels && "Copy"}
      </Button>
    </div>
  );
};
