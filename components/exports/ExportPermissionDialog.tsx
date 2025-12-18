import { FC, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Plus, Trash2, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useExportPermissions } from "@/api/useExportPermissions";
import type { RecurringExport } from "@/api/useRecurringExports";

interface ExportPermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recurringExport: RecurringExport;
}

export const ExportPermissionDialog: FC<ExportPermissionDialogProps> = ({
  isOpen,
  onClose,
  recurringExport,
}) => {
  const [newPrincipal, setNewPrincipal] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { permissions, loading, grantPermission, revokePermission } =
    useExportPermissions(recurringExport.id);

  const handleAddPermission = async () => {
    if (!newPrincipal.trim()) {
      toast({
        title: "Principal required",
        description: "Please enter an AWS account ID or IAM role ARN",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for AWS principals
    const principal = newPrincipal.trim();
    const isAccountId = /^\d{12}$/.test(principal);
    const isArn = principal.startsWith("arn:aws:");

    if (!isAccountId && !isArn) {
      toast({
        title: "Invalid principal",
        description:
          "Enter a 12-digit AWS account ID or a full IAM role/user ARN",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);

    try {
      const success = await grantPermission(principal);

      if (success) {
        toast({
          title: "Permission granted",
          description: `Access granted to ${principal}`,
        });
        setNewPrincipal("");
      } else {
        toast({
          title: "Permission already exists",
          description: "This principal already has access to this export",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to grant permission",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    setDeletingId(permissionId);

    try {
      const success = await revokePermission(permissionId);

      if (success) {
        toast({
          title: "Permission revoked",
          description: "Access has been removed",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to revoke permission",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Export Permissions
          </DialogTitle>
          <DialogDescription>
            Grant AWS accounts or IAM roles access to read the S3 export for{" "}
            <strong>{recurringExport.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add New Permission */}
          <div className="space-y-2">
            <Label htmlFor="principal">Add Permission</Label>
            <div className="flex gap-2">
              <Input
                id="principal"
                placeholder="AWS Account ID or IAM Role ARN"
                value={newPrincipal}
                onChange={(e) => setNewPrincipal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddPermission();
                  }
                }}
              />
              <Button onClick={handleAddPermission} disabled={isAdding}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a 12-digit AWS account ID (e.g., 123456789012) or IAM
              role/user ARN
            </p>
          </div>

          {/* Current Permissions */}
          <div className="space-y-2">
            <Label>Current Permissions</Label>
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading permissions...
              </p>
            ) : !permissions || permissions.length === 0 ? (
              <div className="rounded-md border border-dashed p-4 text-center">
                <UserPlus className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No permissions granted yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">
                        {permission.grantedTo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Granted{" "}
                        {permission.grantedAt
                          ? formatDistanceToNow(
                              new Date(permission.grantedAt),
                              {
                                addSuffix: true,
                              }
                            )
                          : "recently"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokePermission(permission.id)}
                      disabled={deletingId === permission.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* S3 Path Info */}
          {recurringExport.s3Key && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">S3 Path:</p>
              <code className="text-xs break-all">{recurringExport.s3Key}</code>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
