import { CRM_STAGES, TCrmStages } from "@/api/useCrmProject";
import { CrmProject } from "@/api/useCrmProjects";
import CrmLink from "@/components/crm/CrmLink";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { revenueNumber } from "@/helpers/ui-form-helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CurrencyInput from "../forms/CurrencyInput";

const FormSchema = z.object({
  name: z
    .string({ required_error: "Please provide an opportunity name" })
    .min(5, "Use more than 5 characters"),
  isMarketplace: z.boolean(),
  arr: revenueNumber,
  tcv: revenueNumber,
  stage: z.enum(CRM_STAGES),
  crmId: z.string().optional(),
  closeDate: z.date({
    required_error: "Please provide a close date",
  }),
});

type CreateCrmProjectProps = {
  onCreate: (props: Partial<CrmProject>) => Promise<string | undefined>;
  crmProject?: never;
  onChange?: never;
};

type UpdateCrmProjectProps = {
  crmProject: CrmProject;
  onChange: (props: Partial<CrmProject>) => Promise<string | undefined>;
  onCreate?: never;
};

type CrmProjectFormProps = CreateCrmProjectProps | UpdateCrmProjectProps;

const getCrmId = (input: string) => {
  if (/^006\w{15}$/.test(input)) return input;
  const match = input.match(/\/Opportunity\/(006\w{15})\//);
  if (match) return match[1];
  return input;
};

const CrmProjectForm: FC<CrmProjectFormProps> = ({
  crmProject,
  onChange,
  onCreate,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: !crmProject
      ? {
          name: "",
          stage: "Prospect",
          crmId: "",
          arr: 0,
          tcv: 0,
          isMarketplace: false,
        }
      : {
          name: crmProject.name,
          stage: CRM_STAGES.includes(crmProject.stage as TCrmStages)
            ? (crmProject.stage as TCrmStages)
            : "Prospect",
          crmId: crmProject.crmId || "",
          arr: crmProject.arr,
          tcv: crmProject.tcv,
          closeDate: crmProject.closeDate,
          isMarketplace: crmProject.isMarketplace,
        },
  });

  const onOpenChange = (open: boolean) => {
    if (!open) form.reset();
    setFormOpen(open);
  };

  const crmId = form.watch("crmId");

  useEffect(() => {
    if (!crmId) return;
    const processedId = getCrmId(crmId);
    if (processedId === crmId) return;
    form.setValue("crmId", processedId);
  }, [crmId, form]);

  const handleCreate = async (data: z.infer<typeof FormSchema>) => {
    if (!onCreate) return;
    setFormOpen(false);
    const result = await onCreate({
      ...data,
      stage: CRM_STAGES.find((s) => s === data.stage) || "Prospect",
    });
    if (!result) return;
    toast({
      title: "CRM Project created",
      description: `Project with name ${data.name} created.`,
    });
  };

  const handleUpdate = async (data: z.infer<typeof FormSchema>) => {
    if (!onChange) return;
    setFormOpen(false);
    const result = await onChange({
      ...data,
      stage: CRM_STAGES.find((s) => s === data.stage) || "Prospect",
    });
    if (!result) return;
    toast({
      title: "CRM Project updated",
      description: `Project with name ${data.name} updated.`,
    });
  };

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    if (onCreate) return handleCreate(data);
    return handleUpdate(data);
  };

  return (
    <Form {...form}>
      <form>
        <Dialog open={formOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            {onCreate ? (
              <Button size="sm">Create</Button>
            ) : (
              <Edit className="w-5 h-5 text-muted-foreground hover:text-primary" />
            )}
          </DialogTrigger>
          <DialogContent>
            {onCreate ? (
              <DialogHeader>
                <DialogTitle>Create CRM Project</DialogTitle>
                <DialogDescription>
                  Create a record with all the information you have provided in
                  your company&apos;s CRM system.
                </DialogDescription>
              </DialogHeader>
            ) : (
              <DialogHeader>
                <DialogTitle>
                  Update your data according to your company&apos;s CRM system.
                </DialogTitle>

                <DialogDescription></DialogDescription>
              </DialogHeader>
            )}

            <ScrollArea className="h-80 md:h-[30rem] w-[460px]">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Opportunity name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crmId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CRM ID
                        {field.value && field.value.length > 6 && (
                          <CrmLink category="Opportunity" id={field.value} />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Paste Opportunity URL or ID…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isMarketplace"
                  render={({ field }) => (
                    <FormItem className="flex flow-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AWS Marketplace Deal</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arr"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Annual Recurring Revenue</FormLabel>
                      <FormControl>
                        <CurrencyInput value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tcv"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Total Contract Volume</FormLabel>
                      <FormControl>
                        <CurrencyInput value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage for the project…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CRM_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closeDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Close Date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            (onCreate && date < new Date()) || false
                          }
                          defaultMonth={field.value}
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

export default CrmProjectForm;
