import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

type AddControllerDialogProps = {
  account: Account;
};

const AddControllerDialog: FC<AddControllerDialogProps> = ({
  account: { controller, ...account },
}) => {
  const { accounts, assignController } = useAccountsContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleUndoParentAssignment = async (controllerId: string | null) => {
    const parent = await assignController(account.id, controllerId);
    if (!parent) return;
    toast({
      title: "Revised assignment of parent",
      description: `${account.name}'s parent company is now ${
        accounts?.find(({ id }) => id === controllerId)?.name
      } again.`,
    });
  };

  const assignParent = async (parentId: string | null) => {
    if (!accounts) return;
    const previousControllerId: string | null = controller?.id || null;
    const parent = await assignController(account.id, parentId);
    if (!parent) return;
    toast({
      title: !parentId ? "Parent company removed" : "Parent company assigned",
      description: !parentId
        ? `${account.name} has no parent company anymore.`
        : `${account.name}'s parent company is now ${
            accounts.find(({ id }) => id === parentId)?.name
          }.`,
      action: (
        <ToastAction
          altText="Undo changing parent company"
          onClick={() => handleUndoParentAssignment(previousControllerId)}
        >
          Undo
        </ToastAction>
      ),
    });
    setOpen(false);
  };

  return !accounts ? (
    "Loading accounts..."
  ) : (
    <div>
      <div>
        <strong>Parent company:</strong>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-row gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[150px] justify-start"
            >
              {controller?.name || "Select parent…"}
            </Button>
          </PopoverTrigger>
          {controller && (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={() => assignParent(null)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No accounts found.</CommandEmpty>
              <CommandGroup>
                {accounts
                  .filter(({ id }) => id !== account.id)
                  .map(({ id, name }) => (
                    <CommandItem key={id} value={id} onSelect={assignParent}>
                      {name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddControllerDialog;
