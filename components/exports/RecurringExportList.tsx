import { FC } from "react";
import {
  RecurringExportStatus,
  useRecurringExports,
} from "@/api/useRecurringExports";
import { RecurringExportItem } from "./RecurringExportItem";

export const RecurringExportList: FC<{ status: RecurringExportStatus }> = ({
  status,
}) => {
  const { recurringExports, loading, error, mutate } =
    useRecurringExports(status);

  if (loading)
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading recurring exports...
      </div>
    );

  if (error)
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
        Failed to load recurring exports. Please try again.
      </div>
    );

  if (!recurringExports || recurringExports.length === 0)
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No {status} recurring exports
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a recurring export from any account or project page
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {recurringExports.map((exportItem) => (
        <RecurringExportItem
          key={exportItem.id}
          currentStatus={status}
          recurringExport={exportItem}
          onUpdate={() => mutate()}
        />
      ))}
    </div>
  );
};
