import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans from "@/api/useDailyPlans";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import ReviewProjectForDailyPlanning from "@/components/planning/ReviewProjectForDailyPlanning";
import { Accordion } from "@/components/ui/accordion";
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
import { addDaysToDate } from "@/helpers/functional";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, getHours } from "date-fns";
import { flow } from "lodash/fp";
import { CalendarCheck, CalendarIcon, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
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

const DailyPlanningPage = () => {
  const {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
  } = useDailyPlans("PLANNING");
  const { context } = useContextContext();
  const [dailyPlan, setDailyPlan] = useState(
    !dailyPlans ? undefined : dailyPlans.find((p) => p.context === context)
  );
  const [day, setDay] = useState(dailyPlan?.day || new Date());
  const { projects, saveProjectDates } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState(
    filterAndSortProjectsForDailyPlanning(accounts, day)(projects)
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyPlan, context]);

  useEffect(() => {
    const newDaily = !dailyPlans
      ? undefined
      : dailyPlans.find((p) => p.context === context);
    setDailyPlan(newDaily);
    setDay(newDaily?.day || new Date());
  }, [dailyPlans, context]);

  useEffect(() => {
    flow(
      filterAndSortProjectsForDailyPlanning(accounts, day),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projects, day]);

  const handleSubmit = ({ date, goal }: FormValues) => {
    if (!dailyPlan) {
      createDailyPlan(date, goal, context);
    } else {
      confirmDailyPlanning(dailyPlan.id);
    }
  };

  return (
    <MainLayout title="Daily Planning" sectionName="Daily Planning">
      <div className="space-y-6">
        <ApiLoadingError error={error} title="Loading Daily Task List Failed" />

        {isLoading ? (
          <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
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
                            date < addDaysToDate(-1)(new Date()) ||
                            date > addDaysToDate(30)(new Date())
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {!dailyPlan && (
                      <FormDescription>
                        Select the day for which you would like to create a
                        tasks list.
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
                    <CalendarCheck className="w-4 h-4" /> Confirm Daily Plan
                  </div>
                </Button>
              ) : (
                <Button type="submit">
                  <div className="flex flex-row gap-2 items-center">
                    <Play className="w-4 h-4" /> Start Daily Planning
                  </div>
                </Button>
              )}
            </form>
          </Form>
        )}

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
          {!dailyPlan ? (
            "Set a date and a goal for your daily tasks list."
          ) : (
            <div>
              <div>
                Review each project and its tasks and decide which tasks you
                would like to focus on today.
              </div>
              <div>stats</div>
            </div>
          )}
        </div>

        {dailyPlan && (
          <Accordion type="single" collapsible>
            {filteredAndSortedProjects.map((project) => (
              <ReviewProjectForDailyPlanning
                dailyPlan={dailyPlan}
                key={project.id}
                project={project}
                updateOnHoldDate={(onHoldTill) =>
                  saveProjectDates({ projectId: project.id, onHoldTill })
                }
              />
            ))}
          </Accordion>
        )}
      </div>
    </MainLayout>
  );
};

export default DailyPlanningPage;
