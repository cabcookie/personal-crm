import { toast } from "@/components/ui/use-toast";
import {
  parseMigrationExports,
  type MigrationExport,
} from "@/helpers/exports/migration-exports";
import { client } from "@/lib/amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { downloadData, getUrl, list } from "aws-amplify/storage";
import { useState } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";

/**
 * Migration export for nexflow.it (board 9q33.tvg5). Starts the export Lambda
 * and lists the archives it wrote to `exports/<identityId>/migration/`.
 */

const POLL_MS = 10_000;
const START_GRACE_MS = 2 * 60_000;

const getIdentityId = async (): Promise<string> => {
  const { identityId } = await fetchAuthSession();
  if (!identityId) throw new Error("Could not resolve your identity.");
  return identityId;
};

const fetchMigrationExports = async (): Promise<MigrationExport[]> => {
  const identityId = await getIdentityId();
  const { items } = await list({
    path: `exports/${identityId}/migration/`,
    options: { listAll: true },
  });
  return parseMigrationExports(items, new Date());
};

/** Reads the error message the Lambda stored for a failed export. */
export const fetchMigrationExportError = async (
  path: string
): Promise<string> => {
  const { body } = await downloadData({ path }).result;
  const { message } = JSON.parse(await body.text()) as { message?: string };
  return message ?? "Unknown error";
};

export const downloadMigrationExport = async (path: string) => {
  const { url } = await getUrl({ path, options: { expiresIn: 3600 } });
  const link = document.createElement("a");
  link.href = url.toString();
  link.download = path.split("/").pop() ?? "migration-export.zip";
  link.click();
};

const useMigrationExports = () => {
  // Set while the Lambda has been invoked but has not yet written its
  // running marker, so polling starts right away.
  const [starting, setStarting] = useState(false);
  const {
    data: exports,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/migration-exports", fetchMigrationExports, {
    refreshInterval: (latest) =>
      starting || latest?.some((e) => e.status === "running") ? POLL_MS : 0,
    onSuccess: (latest) => {
      if (latest.some((e) => e.status === "running")) setStarting(false);
    },
  });

  const startExport = async () => {
    setStarting(true);
    // If the Lambda fails before writing its running marker, stop polling.
    setTimeout(() => setStarting(false), START_GRACE_MS);
    try {
      const identityId = await getIdentityId();
      const { errors } = await client.mutations.startMigrationExport({
        identityId,
      });
      if (errors) {
        handleApiErrors(errors, "Starting the migration export failed");
        setStarting(false);
        return;
      }
      toast({
        title: "Migration export started",
        description: "This takes a few minutes. The list updates itself.",
      });
      await mutate();
    } catch (err) {
      setStarting(false);
      toast({
        title: "Starting the migration export failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  };

  return {
    exports,
    error,
    isLoading,
    starting: starting || !!exports?.some((e) => e.status === "running"),
    startExport,
    refresh: () => mutate(),
  };
};

export default useMigrationExports;
