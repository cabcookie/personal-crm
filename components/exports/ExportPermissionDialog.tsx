import { FC, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, Plus, Trash2, Shield, UserPlus } from "lucide-react";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { fetchAuthSession } from "aws-amplify/auth";
import outputs from "@/amplify_outputs.json";
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
  const [awsAccountId, setAwsAccountId] = useState<string | null>(null);

  const { permissions, loading, grantPermission, revokePermission } =
    useExportPermissions(recurringExport.id);

  // Recurring exports live in a dedicated bucket — resolve its physical name
  // from amplify_outputs.json by logical name.
  const recurringExportsBucket = (outputs.storage?.buckets ?? []).find(
    (b) => b.name === "recurringExports"
  );
  const bucketName = recurringExportsBucket?.bucket_name ?? null;
  const bucketRegion =
    recurringExportsBucket?.aws_region ?? outputs.storage?.aws_region ?? null;
  // The dedicated bucket contains only recurring exports, so the grantee can
  // be given the bucket URL directly (Quick Suite only accepts bucket URLs,
  // not folder URLs).
  const bucketUri = bucketName ? `s3://${bucketName}` : null;
  const s3Uri =
    bucketName && recurringExport.s3Key
      ? `s3://${bucketName}/${recurringExport.s3Key}`
      : null;
  const bucketArn =
    awsAccountId && bucketName && recurringExport.s3Key
      ? `arn:aws:s3:::${bucketName}/${recurringExport.s3Key}`
      : null;

  useEffect(() => {
    if (!isOpen || awsAccountId || !bucketRegion) return;
    let cancelled = false;
    (async () => {
      try {
        const session = await fetchAuthSession();
        if (!session.credentials) return;
        const sts = new STSClient({
          region: bucketRegion,
          credentials: session.credentials,
        });
        const { Account } = await sts.send(new GetCallerIdentityCommand({}));
        if (!cancelled && Account) setAwsAccountId(Account);
      } catch (error) {
        console.error("Failed to resolve AWS account ID:", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, awsAccountId, bucketRegion]);

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied to clipboard` });
    } catch {
      toast({
        title: "Copy failed",
        description: "Clipboard is unavailable — select and copy manually.",
        variant: "destructive",
      });
    }
  };

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
                    className="flex items-start justify-between gap-2 rounded-md border p-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <code className="block break-all text-xs font-medium">
                        {permission.grantedTo}
                      </code>
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
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bucket & Account Info — what the grantee needs on their side */}
          {(s3Uri || awsAccountId || bucketArn) && (
            <div className="rounded-md bg-muted p-3 text-sm space-y-3">
              <p className="font-medium">Share these with the grantee:</p>

              {awsAccountId && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    AWS Account ID (bucket owner)
                  </p>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 text-xs break-all">
                      {awsAccountId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(awsAccountId, "Account ID")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {bucketUri && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Bucket URL (use this in Quick Suite / S3 data sources)
                  </p>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 text-xs break-all">
                      {bucketUri}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bucketUri, "Bucket URL")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {s3Uri && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Exact file S3 URI
                  </p>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 text-xs break-all">{s3Uri}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(s3Uri, "S3 URI")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {bucketArn && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Bucket object ARN (for their IAM policy)
                  </p>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 text-xs break-all">
                      {bucketArn}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bucketArn, "Bucket ARN")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
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
