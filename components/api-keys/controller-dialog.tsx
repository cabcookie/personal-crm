import { FC } from "react";
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
import { useAccountsContext } from "@/api/ContextAccounts";

export type Controller = {
  accountId: string;
  controllerId: string;
};

interface ControllerDialogProps {
  pendingController: Controller | null;
  setPendingController: (controller: Controller | null) => void;
  setSelectedItemId: (id: string) => void;
}

export const ControllerDialog: FC<ControllerDialogProps> = ({
  pendingController,
  setPendingController,
  setSelectedItemId,
}) => {
  const { getAccountById } = useAccountsContext();

  const handleUseController = (useController: boolean) => {
    if (!pendingController) return;

    if (useController) {
      // Check if the controller also has a parent
      const controller = getAccountById(pendingController.controllerId);
      if (controller?.controller?.id) {
        setPendingController({
          accountId: pendingController.controllerId,
          controllerId: controller.controller.id,
        });
        return;
      }
      setSelectedItemId(pendingController.controllerId);
    } else {
      setSelectedItemId(pendingController.accountId);
    }

    setPendingController(null);
  };

  const controllerAccount = pendingController
    ? getAccountById(pendingController.controllerId)
    : undefined;

  return (
    <AlertDialog
      open={!!pendingController}
      onOpenChange={() => setPendingController(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Use Parent Account?</AlertDialogTitle>
          <AlertDialogDescription>
            The selected account has a parent account:{" "}
            <strong>{controllerAccount?.name}</strong>. Would you like to use
            the parent account instead?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleUseController(false)}>
            Use Selected Account
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleUseController(true)}>
            Use Parent Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
