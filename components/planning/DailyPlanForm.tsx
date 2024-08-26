import useDailyPlans, { DailyPlan } from "@/api/useDailyPlans";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContextContext } from "@/contexts/ContextContext";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, getHours } from "date-fns";
import { CalendarCheck, CalendarIcon, Play } from "lucide-react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  goal: z
    .string({
      required_error: "A goal for the day is required.",
    })
    .min(5, "Please use a minimum of 5 characters."),
  date: z.date({
    required_error: "A date for the tasks is required.",
  }),
});
type FormValues = z.infer<typeof FormSchema>;

type DailyPlanFormProps = {
  dailyPlan: DailyPlan;
  createDailyPlan: ReturnType<typeof useDailyPlans>["createDailyPlan"];
  confirmDailyPlanning: ReturnType<
    typeof useDailyPlans
  >["confirmDailyPlanning"];
};

const DailyPlanForm: FC<DailyPlanFormProps> = ({
  dailyPlan,
  createDailyPlan,
  confirmDailyPlanning,
}) => {
  const { context } = useContextContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goal: dailyPlan?.dayGoal || "",
      date:
        dailyPlan?.day ||
        (getHours(new Date()) < 12 ? new Date() : addDays(new Date(), 1)),
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!context) return;
    form.setValue("goal", dailyPlan?.dayGoal || "");
    form.setValue(
      "date",
      dailyPlan?.day ||
        (getHours(new Date()) < 12 ? new Date() : addDays(new Date(), 1))
    );
  }, [dailyPlan, context]);

  const handleSubmit = ({ date, goal }: FormValues) => {
    if (!dailyPlan) {
      createDailyPlan(date, goal, context);
    } else {
      confirmDailyPlanning(dailyPlan.id);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Planning day</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!!dailyPlan}
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
                    defaultMonth={field.value}
                    disabled={(date) =>
                      date < addDays(new Date(), -1) ||
                      date > addDays(new Date(), 30)
                    }
                  />
                </PopoverContent>
              </Popover>
              {!dailyPlan && (
                <FormDescription>
                  Select the day for which you would like to create a todo list.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal for the day</FormLabel>
              <FormControl>
                <Input
                  placeholder="Define your goal…"
                  {...field}
                  autoFocus
                  disabled={!!dailyPlan}
                />
              </FormControl>
              {!dailyPlan && (
                <FormDescription>
                  Define the overarching goal for the day.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        {dailyPlan ? (
          <Button type="submit">
            <div className="flex flex-row gap-2 items-center">
              <CalendarCheck className="w-4 h-4" />
              Confirm Daily Plan
            </div>
          </Button>
        ) : (
          <Button type="submit">
            <div className="flex flex-row gap-2 items-center">
              <Play className="w-4 h-4" />
              Start Daily Planning
            </div>
          </Button>
        )}
      </form>
    </Form>
  );
};

export default DailyPlanForm;
