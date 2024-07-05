import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CrmLink from "../crm/CrmLink";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import AddControllerDialog from "./AddControllerDialog";
import AddPayerAccountDialog from "./AddPayerAccountDialog";
import AddTerritoryDialog from "./AddTerritoryDialog";

const FormSchema = z.object({
  name: z.string(),
  crmId: z.string(),
});

const getCrmId = (input: string) => {
  if (/^a2pRU\w{13}$/.test(input)) return input;
  const match = input.match(/\/Account\/(001\w{15})\//);
  if (match) return match[1];
  return input;
};

interface OnUpdateProps {
  name: string;
  crmId: string;
}

type AccountUpdateFormProps = {
  account: Account;
  onUpdate: (props: OnUpdateProps) => void;
  formControl?: {
    open: boolean;
    setOpen: (val: boolean) => void;
  };
};

const AccountUpdateForm: FC<AccountUpdateFormProps> = ({
  account,
  onUpdate,
  formControl,
}) => {
  const { addPayerAccount, deletePayerAccount } = useAccountsContext();
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: account.name,
      crmId: account.crmId || "",
    },
  });

  const crmId = form.watch("crmId");

  useEffect(() => {
    if (!crmId) return;
    const processedId = getCrmId(crmId);
    if (processedId === crmId) return;
    form.setValue("crmId", processedId);
  }, [crmId, form]);

  const onOpenChange = (open: boolean) => {
    if (!open) form.reset();
    if (!formControl) {
      setFormOpen(open);
      return;
    }
    formControl.setOpen(open);
  };

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!formControl) setFormOpen(false);
    else setFormOpen(false);
    onUpdate(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog
          open={!formControl ? formOpen : formControl.open}
          onOpenChange={onOpenChange}
        >
          {!formControl && (
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Account
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Account {account.name}</DialogTitle>
              <DialogDescription>Update account information.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-80 md:h-[30rem] w-full">
              <div className="space-y-3 mx-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Account name</FormLabel>
                      <FormControl>
                        <Input placeholder="Account name…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crmId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        CRM ID
                        {field.value.length > 6 && (
                          <CrmLink category="Account" id={field.value} />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paste account URL or ID…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AddControllerDialog account={account} />
                <AddTerritoryDialog account={account} />
                <div className="text-muted-foreground">
                  <AddPayerAccountDialog
                    account={account}
                    addPayerAccount={addPayerAccount}
                    deletePayerAccount={deletePayerAccount}
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="gap-2 mx-1">
              <Button onClick={form.handleSubmit(handleSubmit)}>
                Save changes
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default AccountUpdateForm;
