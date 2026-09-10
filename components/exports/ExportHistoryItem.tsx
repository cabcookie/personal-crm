import { FC, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Trash2, Clock, XCircle, Download, Copy } from "lucide-react";
import { ExportTask, useExports } from "@/api/useExports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getStatusConfig } from "./status-config";
import { downloadData } from "aws-amplify/storage";
import {
  copyToClipboard,
  downloadMarkdown,
} from "@/helpers/exports/markdown-actions";

interface ExportHistoryItemProps {
  task: ExportTask;
  onDelete: () => void;
}

export const ExportHistoryItem: FC<ExportHistoryItemProps> = ({
  task,
  onDelete,
}) => {
  const { deleteExportTask, markExportCompleted } = useExports();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadingFromS3, setIsDownloadingFromS3] = useState(false);

  // Debug: Check why buttons aren't showing
  console.log("Export task data:", {
    id: task.id,
    itemName: task.itemName,
    status: task.status,
    hasResult: !!task.result,
    resultLength: task.result?.length,
    hasError: !!task.error,
    error: task.error,
    hasS3Key: !!task.s3Key,
    s3Key: task.s3Key,
  });

  const statusConfig = getStatusConfig(task);

  const config = statusConfig[task.status || "CREATED"];
  const StatusIcon = config.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExportTask(task.id);
      toast({
        title: "Export deleted",
        description: "Export task has been deleted",
      });
      onDelete();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: `Failed to delete export task: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Download export from S3 (for large exports)
   */
  const downloadFromS3 = async (): Promise<string | null> => {
    if (!task.s3Key) return null;

    try {
      const { body } = await downloadData({ path: task.s3Key }).result;
      const text = await body.text();
      return text;
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

  const handleCopyFromS3 = async () => {
    setIsDownloadingFromS3(true);
    try {
      const content = await downloadFromS3();
      if (!content) return;

      const success = await copyToClipboard(content, task.itemName || "");
      if (success) {
        toast({
          title: "Copied to clipboard",
          description: "Export data copied successfully",
        });
        await markExportCompleted(task.id);
      }
    } finally {
      setIsDownloadingFromS3(false);
    }
  };

  const handleDownloadFromS3 = async () => {
    setIsDownloadingFromS3(true);
    try {
      const content = await downloadFromS3();
      if (!content) return;

      downloadMarkdown(
        content,
        task.itemName || "",
        task.dataSource || "export"
      );
      toast({
        title: "Download started",
        description: "Export file is downloading",
      });
      await markExportCompleted(task.id);
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingFromS3(false);
    }
  };

  const dateRange =
    task.startDate && task.endDate
      ? `${format(new Date(task.startDate), "MMM d, yyyy")} - ${format(
          new Date(task.endDate),
          "MMM d, yyyy"
        )}`
      : "N/A";

  // Read once per mount: calling Date.now() during render is impure and would
  // drift between re-renders.
  const [nowMs] = useState(() => Date.now());

  const createdAgo = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : "N/A";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.itemName}</CardTitle>
            <CardDescription>
              {task.dataSource?.charAt(0).toUpperCase() +
                task.dataSource?.slice(1)}{" "}
              • {dateRange}
            </CardDescription>
          </div>
          <Badge variant={config.variant} className="ml-2">
            <StatusIcon className={`mr-1 h-3 w-3 ${config.iconClass}`} />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Error Message */}
          {task.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Error:</span>
                <span>{task.error}</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created {createdAgo}</span>
            </div>
            {task.ttl && (
              <div className="flex items-center gap-1">
                <span>
                  Auto-deletes in{" "}
                  {Math.ceil((task.ttl * 1000 - nowMs) / (1000 * 60 * 60 * 24))}{" "}
                  days
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {/* All exports are now stored in S3 */}
            {task.status === "GENERATED" && !task.error && task.s3Key && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownloadFromS3}
                  disabled={isDownloadingFromS3}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFromS3}
                  disabled={isDownloadingFromS3}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
