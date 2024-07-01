import { Territory } from "@/api/useTerritories";
import { revenueNumber } from "@/helpers/ui-form-helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CrmLink from "../crm/CrmLink";
import CurrencyInput from "../ui-elements/forms/CurrencyInput";
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
  name: z.string(),
  quota: revenueNumber,
  crmId: z.string(),
  responsibleSince: z.date({
    required_error:
      "Please provide a date for when your responsibility started for this territory",
  }),
});

const getCrmId = (input: string) => {
  if (/^a2pRU\w{13}$/.test(input)) return input;
  const match = input.match(/\/Territory__c\/(a2pRU\w{13})\//);
  if (match) return match[1];
  return input;
};

interface OnUpdateProps {
  name: string;
  crmId: string;
  responsibleSince: Date;
  quota: number;
}

type TerritoryUpdateFormProps = {
  territory: Territory;
  onUpdate: (props: OnUpdateProps) => void;
};

const TerritoryUpdateForm: FC<TerritoryUpdateFormProps> = ({
  territory,
  onUpdate,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: territory?.name || "",
      crmId: territory?.crmId || "",
      quota: territory?.latestQuota || 0,
      responsibleSince: territory?.latestResponsibilityStarted || new Date(),
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
    setFormOpen(open);
  };

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    setFormOpen(false);
    onUpdate({
      name: data.name,
      crmId: data.crmId,
      quota: data.quota,
      responsibleSince: data.responsibleSince,
    });
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={formOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Territory Information</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-80 md:h-[30rem] w-full">
              <div className="space-y-3 mx-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Territory Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Territory Name…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quota"
                  render={({ field: { onChange, value } }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quota</FormLabel>
                      <FormControl>
                        <CurrencyInput value={value || 0} onChange={onChange} />
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
                          <CrmLink category="Territory__c" id={field.value} />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paste territory URL or ID…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsibleSince"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Responsible since</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                          defaultMonth={field.value}
                          captionLayout="dropdown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

export default TerritoryUpdateForm;
