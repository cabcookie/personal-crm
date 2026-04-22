import { FC } from "react";
import { useExports } from "@/api/useExports";
import { ExportHistoryItem } from "@/components/exports/ExportHistoryItem";

export const ExportHistoryList: FC = () => {
  const { exports, loading, error, mutate } = useExports();

  if (loading)
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading export tasks...
      </div>
    );

  if (error)
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
        Failed to load exports. Please try again.
      </div>
    );

  if (!exports || exports.length === 0)
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No exports yet
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Start an export from any account, project, or person page
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {exports.map((task) => (
        <ExportHistoryItem
          key={task.id}
          task={task}
          onDelete={() => mutate()}
        />
      ))}
    </div>
  );
};
