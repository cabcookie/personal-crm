import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { toISODateString } from "@/helpers/functional";
import { EditorJsonContent } from "@/helpers/ui-notes-writer";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { format } from "date-fns";
import useSWR from "swr";
import { OpenTask } from "./ContextOpenTasks";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const dailyPlanStatuses = ["PLANNING", "OPEN", "DONE", "CANCELLED"] as const;
type DailyPlanStatus = (typeof dailyPlanStatuses)[number];

export type DailyPlanTodo = OpenTask & {
  isInFocus: boolean;
};

export type DailyPlan = {
  id: string;
  day: Date;
  dayGoal: string;
  context: Context;
  status: DailyPlanStatus;
  tasks: DailyPlanTodo[];
};

const selectionSet = [
  "id",
  "day",
  "dayGoal",
  "context",
  "status",
  "tasks.isInFocus",
  "tasks.taskIndex",
  "tasks.task",
  "tasks.activity.id",
  "tasks.activity.notesJson",
  "tasks.activity.updatedAt",
  "tasks.activity.meetingActivitiesId",
  "tasks.activity.forProjects.projects.id",
] as const;

type DailyPlanData = SelectionSet<
  Schema["DailyPlan"]["type"],
  typeof selectionSet
>;

const getTask = (task: any): EditorJsonContent => JSON.parse(task);

const mapDailyPlan: (
  dailyPlanStatus: DailyPlanStatus
) => (dayplan: DailyPlanData) => DailyPlan =
  (dailyPlanStatus) =>
  ({ id, day, dayGoal, context, status, tasks }) => ({
    id,
    day: new Date(day),
    dayGoal,
    context: context || "work",
    status,
    tasks: tasks
      .filter((t) => dailyPlanStatus === "PLANNING" || t.isInFocus)
      .map(
        (task): DailyPlanTodo => ({
          task: getTask(task.task),
          isInFocus: task.isInFocus,
          done: getTask(task.task).attrs?.checked || false,
          activityId: task.activity.id,
          index: task.taskIndex,
          projectIds: task.activity.forProjects.map((p) => p.projects.id),
          meetingId: task.activity.meetingActivitiesId || undefined,
          updatedAt: new Date(task.activity.updatedAt),
        })
      ),
  });

const fetchDailyPlans =
  (status: DailyPlanStatus | undefined = "OPEN") =>
  async () => {
    const { data, errors } = await client.models.DailyPlan.listByStatus(
      {
        status,
      },
      {
        sortDirection: "DESC",
        selectionSet,
      }
    );
    if (errors) throw errors;
    if (!data) throw new Error("No daily tasks list fetched");
    return data.map(mapDailyPlan(status));
  };

const useDailyPlans = (status?: DailyPlanStatus) => {
  const {
    data: dailyPlans,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/dayplans/${status}`, fetchDailyPlans(status));

  const createDailyPlan = async (
    day: Date,
    dayGoal: string,
    context?: Context
  ) => {
    if (!context) return;
    const updated: DailyPlan[] = [
      {
        id: crypto.randomUUID(),
        day,
        dayGoal,
        status: "PLANNING",
        context,
        tasks: [],
      },
      ...(dailyPlans || []),
    ];
    mutate(updated, false);
    const { data, errors } = await client.models.DailyPlan.create({
      day: toISODateString(day),
      dayGoal,
      status: "PLANNING",
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating task list for the day");
    if (!data) throw new Error("createDailyPlan didn't return result data");
    mutate(updated);
    return data.id;
  };

  const confirmDailyPlanning = async (dailyPlanId: string) => {
    const updated: DailyPlan[] | undefined = dailyPlans?.filter(
      (p) => p.id !== dailyPlanId
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlan.update({
      id: dailyPlanId,
      status: "OPEN",
    });
    if (errors) handleApiErrors(errors, "Confirming daily plan failed");
    if (updated) mutate(updated);
    if (!data) return;
    toast({ title: `Confirmed task list for ${format(data.day, "PP")}` });
    return data.id;
  };

  const getExistingTask = async (
    dailyPlanId: string,
    activityId: string,
    taskIndex: number
  ) => {
    const { data, errors } = await client.models.DailyPlanTask.get({
      dailyPlanId,
      activityId,
      taskIndex,
    });
    if (errors) handleApiErrors(errors, "Finding existing task failed");
    return data;
  };

  const makeTaskDecision = async (
    openTask: OpenTask,
    dailyPlanId: string,
    isInFocus: boolean
  ) => {
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) =>
      p.id !== dailyPlanId
        ? p
        : {
            ...p,
            tasks: [
              ...(p.tasks || []),
              {
                ...openTask,
                isInFocus,
              },
            ],
          }
    );
    if (updated) mutate(updated, false);
    const existingTask = await getExistingTask(
      dailyPlanId,
      openTask.activityId,
      openTask.index
    );
    if (existingTask) {
      const { data, errors } = await client.models.DailyPlanTask.update({
        dailyPlanId,
        activityId: openTask.activityId,
        taskIndex: openTask.index,
        isInFocus,
        task: JSON.stringify(openTask.task),
      });
      if (errors) handleApiErrors(errors, "Updating daily plan's task failed");
      if (updated) mutate(updated);
      if (!data) return;
      toast({ title: "Daily plan's task updated" });
      return data;
    } else {
      const { data, errors } = await client.models.DailyPlanTask.create({
        dailyPlanId,
        activityId: openTask.activityId,
        taskIndex: openTask.index,
        isInFocus,
        task: JSON.stringify(openTask.task),
      });
      if (errors) handleApiErrors(errors, "Creating daily plan's task failed");
      if (updated) mutate(updated);
      if (!data) return;
      toast({ title: "Daily plan's task created" });
      return data;
    }
  };

  return {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    makeTaskDecision,
  };
};

export default useDailyPlans;
