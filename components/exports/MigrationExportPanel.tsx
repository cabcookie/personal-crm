import useMigrationExports, {
  downloadMigrationExport,
  fetchMigrationExportError,
} from "@/api/useMigrationExports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type {
  MigrationExport,
  MigrationExportStatus,
} from "@/helpers/exports/migration-exports";
import { format } from "date-fns";
import { Download, Loader2, PackageOpen } from "lucide-react";
import { FC, useState } from "react";

const STATUS_LABEL: Record<MigrationExportStatus, string> = {
  running: "Running",
  aborted: "Aborted",
  done: "Ready",
  failed: "Failed",
};

const STATUS_VARIANT: Record<
  MigrationExportStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  running: "secondary",
  aborted: "destructive",
  done: "default",
  failed: "destructive",
};

const formatSize = (size: number | null) =>
  size === null
    ? ""
    : size < 1024 * 1024
      ? `${Math.max(1, Math.round(size / 1024))} KB`
      : `${(size / 1024 / 1024).toFixed(1)} MB`;

const MigrationExportRow: FC<{ entry: MigrationExport }> = ({ entry }) => {
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const download = async () => {
    if (!entry.path) return;
    setBusy(true);
    try {
      await downloadMigrationExport(entry.path);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const showError = async () => {
    if (!entry.path) return;
    setBusy(true);
    try {
      setErrorText(await fetchMigrationExportError(entry.path));
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_VARIANT[entry.status]}>
            {entry.status === "running" && (
              <Loader2 className="size-3 mr-1 animate-spin" />
            )}
            {STATUS_LABEL[entry.status]}
          </Badge>
          <span className="text-sm">{format(entry.startedAt, "PPpp")}</span>
          <span className="text-sm text-muted-foreground">
            {formatSize(entry.size)}
          </span>
        </div>
        {entry.status === "done" && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={download}
          >
            <Download className="size-4 mr-1" />
            Download
          </Button>
        )}
        {entry.status === "failed" && !errorText && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={showError}>
            Show error
          </Button>
        )}
      </div>
      {errorText && (
        <p className="text-sm text-destructive break-words">{errorText}</p>
      )}
      {entry.status === "aborted" && (
        <p className="text-sm text-muted-foreground">
          The export did not finish within 15 minutes.
        </p>
      )}
    </div>
  );
};

export const MigrationExportPanel: FC = () => {
  const { exports, error, isLoading, starting, startExport } =
    useMigrationExports();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Exports all people, accounts, projects, meetings, notes, learnings and
        note images as one ZIP file for the move to nexflow.it. Your data in
        Personal CRM stays unchanged; you can export as often as you like.
        Archives are deleted automatically after 90 days.
      </p>
      <Button onClick={startExport} disabled={starting}>
        {starting ? (
          <Loader2 className="size-4 mr-2 animate-spin" />
        ) : (
          <PackageOpen className="size-4 mr-2" />
        )}
        {starting ? "Export running…" : "Export for nexflow.it"}
      </Button>
      {error && (
        <p className="text-sm text-destructive">
          Could not load migration exports: {String(error)}
        </p>
      )}
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading exports…</p>
      )}
      {exports?.length === 0 && (
        <p className="text-sm text-muted-foreground">No exports yet.</p>
      )}
      <div className="space-y-2">
        {exports?.map((entry) => (
          <MigrationExportRow key={entry.stamp} entry={entry} />
        ))}
      </div>
    </div>
  );
};
