import { FC, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Calendar,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Download,
  Copy,
} from "lucide-react";
import {
  useRecurringExports,
  type RecurringExport,
} from "@/api/useRecurringExports";
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
import { ExportPermissionDialog } from "./ExportPermissionDialog";
import { Schema } from "@/amplify/data/resource";
import { DeleteAlert } from "./DeleteAlert";
import { downloadData } from "aws-amplify/storage";
import {
  copyToClipboard,
  downloadMarkdown,
} from "@/helpers/exports/markdown-actions";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface RecurringExportItemProps {
  currentStatus: Schema["RecurringExportStatus"]["type"];
  recurringExport: RecurringExport;
  onUpdate: () => void;
}

export const RecurringExportItem: FC<RecurringExportItemProps> = ({
  currentStatus,
  recurringExport,
  onUpdate,
}) => {
  const {
    deleteRecurringExport,
    activateRecurringExport,
    deactivateRecurringExport,
  } = useRecurringExports(currentStatus);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isDownloadingExport, setIsDownloadingExport] = useState(false);

  const isActive = recurringExport.status === "active";
  const hasError = (recurringExport.errorCount ?? 0) > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRecurringExport(recurringExport.id);
      toast({
        title: "Recurring export deleted",
        description: "The recurring export has been deleted.",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      if (isActive) {
        await deactivateRecurringExport(recurringExport.id);
        toast({
          title: "Export paused",
          description: "The recurring export has been paused.",
        });
      } else {
        await activateRecurringExport(recurringExport.id);
        toast({
          title: "Export activated",
          description: "The recurring export has been activated.",
        });
      }
      onUpdate();
    } catch (error) {
      toast({
        title: "Failed to update status",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  /**
   * Download recurring export from S3
   */
  const downloadFromS3 = async (): Promise<string | null> => {
    if (!recurringExport.s3Key) return null;

    try {
      const { body } = await downloadData({
        path: recurringExport.s3Key,
        options: { bucket: "recurringExports" },
      }).result;
      const text = await body.text();
      return text;
    } catch (error) {
      console.error("Failed to download recurring export from S3:", error);
      toast({
        title: "Download failed",
        description: "Could not fetch export from S3",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCopyExport = async () => {
    setIsDownloadingExport(true);
    try {
      const content = await downloadFromS3();
      if (!content) return;

      const success = await copyToClipboard(content, recurringExport.name);
      if (success) {
        toast({
          title: "Copied to clipboard",
          description: "Export data copied successfully",
        });
      }
    } finally {
      setIsDownloadingExport(false);
    }
  };

  const handleDownloadExport = async () => {
    setIsDownloadingExport(true);
    try {
      const content = await downloadFromS3();
      if (!content) return;

      downloadMarkdown(
        content,
        recurringExport.name,
        recurringExport.dataSource || "export"
      );
      toast({
        title: "Download started",
        description: "Export file is downloading",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingExport(false);
    }
  };

  const getScheduleText = () => {
    const { frequency, dayOfWeek, dayOfMonth, timeOfDay } = recurringExport;
    const time = timeOfDay || "00:00";

    switch (frequency) {
      case "daily":
        return `Daily at ${time} UTC`;
      case "weekly":
        return `Weekly on ${DAYS_OF_WEEK[dayOfWeek ?? 0]} at ${time} UTC`;
      case "monthly":
        return `Monthly on day ${dayOfMonth ?? 1} at ${time} UTC`;
      default:
        return `${frequency} at ${time} UTC`;
    }
  };

  const nextRunText = recurringExport.nextRunAt
    ? formatDistanceToNow(new Date(recurringExport.nextRunAt), {
        addSuffix: true,
      })
    : "Not scheduled";

  const lastRunText = recurringExport.lastRunAt
    ? formatDistanceToNow(new Date(recurringExport.lastRunAt), {
        addSuffix: true,
      })
    : "Never";

  return (
    <Card className={!isActive ? "opacity-60" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{recurringExport.name}</CardTitle>
            <CardDescription>
              {recurringExport.dataSource?.charAt(0).toUpperCase() +
                recurringExport.dataSource?.slice(1)}{" "}
              • {recurringExport.itemName} • Last{" "}
              {recurringExport.daysToInclude} days
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? (
              <>
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <Pause className="mr-1 h-3 w-3" />
                Paused
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Error Message */}
          {hasError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span className="font-medium">
                  Error ({recurringExport.errorCount} failures):
                </span>
                <span>{recurringExport.lastError}</span>
              </div>
            </div>
          )}

          {/* Schedule Info */}
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-4" />
              <span>{getScheduleText()}</span>
            </div>
            {isActive && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>Next run {nextRunText}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Last run: {lastRunText}</span>
            </div>
            {recurringExport.s3Key && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span className="text-green-600">Export available</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {/* Copy/Download buttons - show when export is available */}
            {recurringExport.s3Key && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownloadExport}
                  disabled={isDownloadingExport}
                >
                  <Download className="mr-2 size-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyExport}
                  disabled={isDownloadingExport}
                >
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
              </>
            )}

            <Button
              variant={isActive ? "outline" : "default"}
              size="sm"
              onClick={handleToggleStatus}
              disabled={isToggling}
            >
              {isToggling ? (
                <RefreshCw className="mr-2 size-4 animate-spin" />
              ) : isActive ? (
                <Pause className="mr-2 size-4" />
              ) : (
                <Play className="mr-2 size-4" />
              )}
              {isActive ? "Pause" : "Activate"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPermissions(true)}
            >
              <Shield className="mr-2 size-4" />
              Permissions
            </Button>

            <DeleteAlert
              isDeleting={isDeleting}
              onConfirm={handleDelete}
              name={recurringExport.name}
            />
          </div>
        </div>
      </CardContent>

      <ExportPermissionDialog
        isOpen={showPermissions}
        onClose={() => setShowPermissions(false)}
        recurringExport={recurringExport}
      />
    </Card>
  );
};
