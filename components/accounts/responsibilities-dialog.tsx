import { Account } from "@/api/ContextAccounts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toLocaleDateString } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Edit } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "../ui/use-toast";
import ResponsibilitiesList from "./ResponsibilitiesList";
import { Responsibility } from "./ResponsibilityRecord";

const FormSchema = z
  .object({
    startDate: z.date({
      required_error: "Please provide a start date for this responsibility",
    }),
    endDate: z.date().optional(),
  })
  .refine(({ startDate, endDate }) => !endDate || endDate > startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

type CreateResponsibility = {
  account: Account;
  addResponsibility: (
    accountId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
  updateAccount?: never;
  updateResponsibility?: never;
};

type UpdateResponsibility = {
  account?: never;
  addResponsibility?: never;
  updateAccount: Responsibility;
  updateResponsibility: (
    responsibilityId: string,
    startDate: Date,
    endDate?: Date
  ) => void;
};

type ResponsibilitiesDialogProps = CreateResponsibility | UpdateResponsibility;

const ResponsibilitiesDialog: FC<ResponsibilitiesDialogProps> = ({
  account,
  addResponsibility,
  updateAccount,
  updateResponsibility,
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: !updateAccount
      ? undefined
      : { startDate: updateAccount.startDate, endDate: updateAccount.endDate },
  });

  const onAddSubmit = ({ startDate, endDate }: z.infer<typeof FormSchema>) => {
    if (!account) return;
    toast({
      title: "Responsibility created",
      description: `Responsibility created for account ${account.name} from ${[
        startDate,
        ...(endDate ? [endDate] : []),
      ]
        .map(toLocaleDateString)
        .join(" to ")}.`,
    });
    setOpen(false);
    addResponsibility(account.id, startDate, endDate);
  };

  const onUpdateSubmit = ({
    startDate,
    endDate,
  }: z.infer<typeof FormSchema>) => {
    if (!updateAccount) return;
    toast({
      title: "Responsibility updated",
      description: `Responsibility updated for account ${
        updateAccount.accountName
      } from ${[startDate, ...(endDate ? [endDate] : [])]
        .map(toLocaleDateString)
        .join(" to ")}.`,
    });
    setOpen(false);
    updateResponsibility(updateAccount.id, startDate, endDate);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (addResponsibility) return onAddSubmit(data);
    return onUpdateSubmit(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {addResponsibility ? (
              <Button size="sm">Add Responsibility</Button>
            ) : (
              <Edit className="w-5 h-5 text-muted-foreground hover:text-primary" />
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {updateAccount
                  ? `Update Responsibility ${updateAccount.accountName}`
                  : `Responsibilities ${account.name}`}
              </DialogTitle>
            </DialogHeader>
            {account && (
              <div>
                <small>
                  <div>
                    <strong>Existing responsibilities:</strong>
                  </div>
                  <div>
                    <ResponsibilitiesList
                      responsibilities={account.responsibilities}
                    />
                  </div>
                </small>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a start date…</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      When is your responsibility for this account beginning?
                    </FormDescription>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick an end date…</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <= form.getValues().startDate
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      When will your responsibility end for this account?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Save changes
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
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

export default ResponsibilitiesDialog;
