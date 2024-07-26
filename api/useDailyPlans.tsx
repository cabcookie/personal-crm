import { type Schema } from "@/amplify/data/resource";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { toISODateString } from "@/helpers/functional";
import { calcPipeline } from "@/helpers/projects";
import {
  EditorJsonContent,
  getTaskByIndex,
  getTasksData,
  transformNotesVersion,
  updateTaskStatus,
} from "@/helpers/ui-notes-writer";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import {
  filter,
  findIndex,
  flatMap,
  flow,
  sortBy,
  union,
  uniq,
} from "lodash/fp";
import useSWR from "swr";
import { OpenTask } from "./ContextOpenTasks";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const dailyPlanStatuses = ["PLANNING", "OPEN", "DONE", "CANCELLED"] as const;
type DailyPlanStatus = (typeof dailyPlanStatuses)[number];

export type DailyPlanTodo = OpenTask & {
  isInFocus: boolean;
  order: number;
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
  "tasks.activity.forProjects.projects.crmProjects.crmProject.id",
  "tasks.activity.forProjects.projects.crmProjects.crmProject.closeDate",
  "tasks.activity.forProjects.projects.crmProjects.crmProject.isMarketplace",
  "tasks.activity.forProjects.projects.crmProjects.crmProject.annualRecurringRevenue",
  "tasks.activity.forProjects.projects.crmProjects.crmProject.totalContractVolume",
  "tasks.activity.forProjects.projects.crmProjects.crmProject.stage",
] as const;

type DailyPlanData = SelectionSet<
  Schema["DailyPlan"]["type"],
  // @ts-expect-error TS2344
  typeof selectionSet
>;
type TaskData = DailyPlanData["tasks"][number];

const getTask = (task: any): EditorJsonContent => JSON.parse(task);

const calcTaskOrder = (task: TaskData, maxProjectIndex: number): number =>
  calcPipeline(
    task.activity.forProjects.map((p) => ({
      projects: { crmProjects: p.projects.crmProjects },
    }))
  ) +
  maxProjectIndex * 10 +
  (getTask(task.task).attrs?.checked || false ? 0 : 1);

const getProjectIndex = (tasks: TaskData[], task: TaskData) =>
  flow(
    flatMap((task: TaskData) =>
      task.activity.forProjects.map((p) => p.projects.id)
    ),
    uniq,
    findIndex((projectId) =>
      task.activity.forProjects.some((p) => p.projects.id === projectId)
    )
  )(tasks);

const mapDailyPlanTodos = (tasks: TaskData[]) =>
  tasks.map((task) => ({
    task: getTask(task.task),
    isInFocus: task.isInFocus,
    done: getTask(task.task).attrs?.checked || false,
    activityId: task.activity.id,
    index: task.taskIndex,
    projectIds: task.activity.forProjects.map((p) => p.projects.id),
    order: calcTaskOrder(task, getProjectIndex(tasks, task)),
    meetingId: task.activity.meetingActivitiesId || undefined,
    updatedAt: new Date(task.activity.updatedAt),
  }));

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
    tasks: flow(
      filter((t: TaskData) => dailyPlanStatus === "PLANNING" || t.isInFocus),
      mapDailyPlanTodos,
      sortBy((t) => -t.order)
    )(tasks),
  });

const fetchDailyPlans =
  (status: DailyPlanStatus | undefined = "OPEN") =>
  async (): Promise<DailyPlan[] | undefined> => {
    // @ts-expect-error TS2589
    const { data, errors } = await client.models.DailyPlan.listByStatus(
      { status },
      // @ts-expect-error TS2589
      { sortDirection: "DESC", selectionSet }
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
                order: 0,
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

  const handleUndoFinishDailyTaskList =
    (dailyPlan: DailyPlan, toaster: typeof toast) => async () => {
      const updated: DailyPlan[] = flow(
        union([dailyPlan]),
        sortBy((p) => -p.day.getTime())
      )(dailyPlans);
      mutate(updated, false);
      const { data, errors } = await client.models.DailyPlan.update({
        id: dailyPlan.id,
        status: "OPEN",
      });
      if (errors)
        handleApiErrors(errors, "Undoing finishing daily plan's task failed");
      if (updated) mutate(updated);
      if (!data) return;
      toaster({
        title: "Re-opened Daily task list",
        description: `Daily task list with title “${
          dailyPlan.dayGoal
        }” for ${format(dailyPlan.day, "PP")} is open again.`,
      });
      return data.id;
    };

  const finishDailyTaskList = async (
    dailyPlanId: string,
    toaster: typeof toast
  ) => {
    const oldDailyPlan = dailyPlans?.find((p) => p.id === dailyPlanId);
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) =>
      p.id !== dailyPlanId ? p : { ...p, status: "DONE" }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlan.update({
      id: dailyPlanId,
      status: "DONE",
    });
    if (errors) handleApiErrors(errors, "Finishing task list failed");
    if (updated) mutate(updated);
    if (!data) return;
    toaster({
      title: "Daily task list completed",
      description: `You completed the daily task list with title “${
        data.dayGoal
      }” for ${format(data.day, "PP")}`,
      action: oldDailyPlan && (
        <ToastAction
          altText="Undo finishing task list"
          onClick={handleUndoFinishDailyTaskList(oldDailyPlan, toaster)}
        >
          Undo
        </ToastAction>
      ),
    });
    return data.id;
  };

  const getActivityNotes = async (activityId: string) => {
    const { data, errors } = await client.models.Activity.get({
      id: activityId,
    });
    if (errors) handleApiErrors(errors, "Fetching activity with tasks failed");
    if (!data) return;
    return transformNotesVersion(data);
  };

  const finishTask = async (
    activityId: string,
    index: number,
    finished: boolean
  ) => {
    const notes = await getActivityNotes(activityId);
    if (!notes) return;
    const updated = updateTaskStatus(notes, index, finished);
    const { hasOpenTasks } = getTasksData(updated);
    const { data, errors } = await client.models.Activity.update({
      id: activityId,
      hasOpenTasks: hasOpenTasks ? "true" : "false",
      formatVersion: 2,
      notes: null,
      notesJson: JSON.stringify(updated),
    });
    if (errors) handleApiErrors(errors, "Task status updated");
    if (!data) return;
    toast({ title: "Task status updated" });
    return getTaskByIndex(updated, index);
  };

  const finishDailyTask = async (
    dailyPlanId: string,
    { activityId, index }: DailyPlanTodo,
    finished: boolean
  ) => {
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) =>
      p.id !== dailyPlanId
        ? p
        : {
            ...p,
            tasks: p.tasks.map((t) =>
              t.activityId !== activityId || t.index !== index
                ? t
                : {
                    ...t,
                    done: finished,
                  }
            ),
          }
    );
    if (updated) mutate(updated, false);
    const updatedTask = await finishTask(activityId, index, finished);
    const { data, errors } = await client.models.DailyPlanTask.update({
      dailyPlanId,
      activityId: activityId,
      taskIndex: index,
      task: JSON.stringify(updatedTask),
    });
    if (errors) handleApiErrors(errors, "Updating daily task item failed");
    if (updated) mutate(updated);
    return data;
  };

  return {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    makeTaskDecision,
    finishDailyTaskList,
    finishDailyTask,
  };
};

export default useDailyPlans;
