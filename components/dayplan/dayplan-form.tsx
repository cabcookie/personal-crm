import { addDaysToDate } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  goal: z
    .string({
      required_error: "A goal for the day is required.",
    })
    .min(3, "Please use a minimum of 3 characters."),
  date: z.date({
    required_error: "A date for the tasks is required.",
  }),
});

type DayPlanFormProps = {
  onSubmit: (goal: string, date: Date) => void;
  onCancel?: () => void;
  className?: string;
};

const DayPlanForm: FC<DayPlanFormProps> = ({
  className,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { goal: "" },
  });
  const { toast } = useToast();

  const handleSubmit = ({ date, goal }: z.infer<typeof FormSchema>) => {
    toast({
      title: "You created a new day plan.",
      description: `Your goal for ${date.toLocaleDateString()} is "${goal}".`,
    });
    onSubmit(goal, date);
  };

  return (
    <div className={className}>
      <h4 className="md:text-lg font-semibold tracking-tight">
        Create a plan for the day
      </h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Define your goal…" {...field} autoFocus />
                </FormControl>
                <FormDescription>
                  Define the overarching goal for the day.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < addDaysToDate(-1)(new Date()) ||
                        date > addDaysToDate(30)(new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the day for which you would like to create a tasks
                  list.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <Button type="submit">Submit</Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DayPlanForm;
