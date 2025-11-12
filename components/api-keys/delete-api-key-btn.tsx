import useApiKeys from "@/api/useApiKeys";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

interface DeleteApiKeyBtnProps {
  apiKey: string;
}

export const DeleteApiKeyBtn: FC<DeleteApiKeyBtnProps> = ({ apiKey }) => {
  const { deleteApiKey } = useApiKeys();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteApiKey = async () => {
    await deleteApiKey(apiKey);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting this API key will break any
              external integrations that depend on it. Are you sure you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApiKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
