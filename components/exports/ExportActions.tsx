import { FC, useState } from "react";
import { Download, Copy } from "lucide-react";
import { downloadData } from "aws-amplify/storage";
import { Button } from "@/components/ui/button";
import {
  copyToClipboard,
  downloadMarkdown,
} from "@/helpers/exports/markdown-actions";
import { toast } from "@/components/ui/use-toast";
import { useExports } from "@/api/useExports";

interface ExportActionsProps {
  taskId: string;
  s3Key: string;
  itemName: string;
  dataSource: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showLabels?: boolean;
}

export const ExportActions: FC<ExportActionsProps> = ({
  taskId,
  s3Key,
  itemName,
  dataSource,
  variant = "default",
  size = "sm",
  showLabels = true,
}) => {
  const { markExportCompleted } = useExports();
  const [isBusy, setIsBusy] = useState(false);

  const fetchContent = async (): Promise<string | null> => {
    try {
      const { body } = await downloadData({ path: s3Key }).result;
      return await body.text();
    } catch (error) {
      console.error("Failed to download export from S3:", error);
      toast({
        title: "Download failed",
        description: "Could not fetch export from S3",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCopy = async () => {
    setIsBusy(true);
    try {
      const content = await fetchContent();
      if (!content) return;

      const success = await copyToClipboard(content, itemName);
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
    } finally {
      setIsBusy(false);
    }
  };

  const handleDownload = async () => {
    setIsBusy(true);
    try {
      const content = await fetchContent();
      if (!content) return;

      downloadMarkdown(content, itemName, dataSource);
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
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isBusy}
      >
        <Download className={showLabels ? "mr-2 size-4" : "size-4"} />
        {showLabels && "Download"}
      </Button>
      <Button
        variant={variant === "default" ? "outline" : variant}
        size={size}
        onClick={handleCopy}
        disabled={isBusy}
      >
        <Copy className={showLabels ? "mr-2 size-4" : "size-4"} />
        {showLabels && "Copy"}
      </Button>
    </div>
  );
};
