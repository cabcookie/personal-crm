import { type Schema } from "@/amplify/data/resource";
import { client } from "@/lib/amplify";
import useSWR from "swr";
import { handleApiErrors } from "./globals";

export type ExportPermission = Schema["ExportPermission"]["type"];

/**
 * Fetcher function for SWR to load permissions for a specific recurring export
 */
const createFetcher =
  (recurringExportId: string) => async (): Promise<ExportPermission[]> => {
    const { data, errors } =
      await client.models.ExportPermission.listExportPermissionByRecurringExportId(
        {
          recurringExportId,
        }
      );
    if (errors) {
      handleApiErrors(errors, "Failed fetching export permissions");
      return [];
    }
    return data || [];
  };

/**
 * Hook to fetch and manage export permissions for a recurring export
 */
export function useExportPermissions(recurringExportId: string | null) {
  const { data, error, mutate, isLoading } = useSWR<ExportPermission[]>(
    recurringExportId ? `/api/export-permissions/${recurringExportId}` : null,
    recurringExportId ? createFetcher(recurringExportId) : null
  );

  /**
   * Grant permission to an AWS account or IAM role
   */
  const grantPermission = async (grantedTo: string): Promise<boolean> => {
    if (!recurringExportId) return false;

    // Check for duplicate
    if (data?.some((p) => p.grantedTo === grantedTo)) {
      return false;
    }

    const { data: created, errors } =
      await client.models.ExportPermission.create({
        recurringExportId,
        grantedTo,
        grantedBy: "current-user", // Will be set by owner auth
        grantedAt: new Date().toISOString(),
      });

    if (errors) {
      handleApiErrors(errors, "Failed granting permission");
      return false;
    }

    if (created) {
      mutate([...(data || []), created]);
    }

    return true;
  };

  /**
   * Revoke a permission
   */
  const revokePermission = async (permissionId: string): Promise<boolean> => {
    const updated = data?.filter((p) => p.id !== permissionId);
    if (updated) mutate(updated, false);

    const { errors } = await client.models.ExportPermission.delete({
      id: permissionId,
    });

    if (errors) {
      handleApiErrors(errors, "Failed revoking permission");
      mutate(); // Revert on error
      return false;
    }

    if (updated) mutate(updated);
    return true;
  };

  return {
    permissions: data,
    error,
    loading: isLoading,
    mutate,
    grantPermission,
    revokePermission,
  };
}
