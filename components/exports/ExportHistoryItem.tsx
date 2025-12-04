import { FC, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Trash2, Clock, XCircle } from "lucide-react";
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
import { ExportActions } from "./ExportActions";

interface ExportHistoryItemProps {
  task: ExportTask;
  onDelete: () => void;
}

export const ExportHistoryItem: FC<ExportHistoryItemProps> = ({
  task,
  onDelete,
}) => {
  const { deleteExportTask } = useExports();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const dateRange =
    task.startDate && task.endDate
      ? `${format(new Date(task.startDate), "MMM d, yyyy")} - ${format(
          new Date(task.endDate),
          "MMM d, yyyy"
        )}`
      : "N/A";

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
                  {Math.ceil(
                    (task.ttl * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {task.status === "GENERATED" && !task.error && task.result && (
              <ExportActions
                taskId={task.id}
                result={task.result}
                itemName={task.itemName || ""}
                dataSource={task.dataSource || ""}
                variant="default"
                size="sm"
                showLabels={true}
              />
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
