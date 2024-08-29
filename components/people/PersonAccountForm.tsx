import {
  PersonAccount,
  PersonAccountCreateProps,
  PersonAccountUpdateProps,
} from "@/helpers/person/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears } from "date-fns";
import { Edit, PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AccountSelector from "../ui-elements/selectors/account-selector";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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

const FormSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  position: z.string().optional(),
  accountId: z.string({
    required_error: "Please provide an account relationship",
  }),
});

type CreatePersonAccountProps = {
  onCreate: (props: PersonAccountCreateProps) => Promise<string | undefined>;
  personAccount?: never;
  onChange?: never;
};

type UpdatePersonAccountProps = {
  onCreate?: never;
  personAccount: PersonAccount;
  onChange: (props: PersonAccountUpdateProps) => Promise<string | undefined>;
};

type PersonAccountFormProps = (
  | CreatePersonAccountProps
  | UpdatePersonAccountProps
) & {
  personName: string;
};

const PersonAccountForm: FC<PersonAccountFormProps> = ({
  onChange,
  onCreate,
  personAccount,
  personName,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: personAccount?.startDate,
      endDate: personAccount?.endDate,
      position: personAccount?.position || "",
      accountId: personAccount?.accountId,
    },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) form.reset();
    setFormOpen(open);
  };

  const handleCreate = (data: z.infer<typeof FormSchema>) =>
    onCreate && onCreate(data);

  const handleUpdate = (data: z.infer<typeof FormSchema>) =>
    onChange &&
    onChange({ ...data, personAccountId: personAccount.personAccountId });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    setFormOpen(false);
    form.reset();
    (onCreate ? handleCreate : handleUpdate)(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={formOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            {onCreate ? (
              <Button size="sm" className="gap-1">
                <PlusCircle className="w-4 h-4" />
                Work history
              </Button>
            ) : (
              <Edit className="w-5 h-5 text-muted-foreground hover:text-primary" />
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Work history</DialogTitle>
              <DialogDescription>
                {`${
                  onCreate ? "Create a" : "Update the "
                } work history record for ${personName}.`}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-80 md:h-[30rem] w-[460px]">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          value={field.value}
                          placeholder="Select account…"
                          onChange={field.onChange}
                          allowCreateAccounts
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Position name…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown"
                          className="w-[17.5rem]"
                          startMonth={addYears(new Date(), -50)}
                          endMonth={addYears(new Date(), 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          defaultMonth={field.value}
                          selected={field.value}
                          captionLayout="dropdown"
                          className="w-[17.5rem]"
                          startMonth={addYears(new Date(), -50)}
                          endMonth={addYears(new Date(), 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={form.handleSubmit(handleSubmit)}>
                {onCreate ? "Create" : "Save changes"}
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

export default PersonAccountForm;
