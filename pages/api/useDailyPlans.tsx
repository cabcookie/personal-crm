import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { toISODateString } from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import useSWR from "swr";
const client = generateClient<Schema>();

const dailyPlanStatuses = ["PLANNING", "OPEN", "DONE", "CANCELLED"] as const;
type DailyPlanStatus = (typeof dailyPlanStatuses)[number];

export type DailyPlanTodo = {
  recordId: string;
  todoId: string;
  todo: JSONContent;
  done: boolean;
  projectIds: string[];
  activityId: string;
};

export type DailyPlan = {
  id: string;
  day: Date;
  dayGoal: string;
  context: Context;
  status: DailyPlanStatus;
  todos: DailyPlanTodo[];
};

const selectionSet = [
  "id",
  "day",
  "dayGoal",
  "context",
  "status",
  "todos.id",
  "todos.todo.id",
  "todos.todo.todo",
  "todos.todo.status",
  "todos.todo.activity.type",
  "todos.todo.activity.activity.id",
  "todos.todo.activity.activityId",
  "todos.todo.projects.projectIdTodoStatus",
] as const;

type DailyPlanData = SelectionSet<
  Schema["DailyPlan"]["type"],
  typeof selectionSet
>;

const mapDailyPlan: (dayplan: DailyPlanData) => DailyPlan = ({
  id,
  day,
  dayGoal,
  context,
  status,
  todos,
}) => ({
  id,
  day: new Date(day),
  dayGoal,
  context: context || "work",
  status,
  todos: todos.map(
    ({
      id: recordId,
      todo: {
        id: todoId,
        projects,
        status,
        todo,
        activity: { activityId },
      },
    }): DailyPlanTodo => ({
      recordId,
      todoId,
      todo: JSON.parse(todo as any),
      done: status === "DONE",
      projectIds: projects.map((p) =>
        p.projectIdTodoStatus.replaceAll("-DONE", "").replaceAll("-OPEN", "")
      ),
      activityId,
    })
  ),
});

const fetchDailyPlans =
  (status: DailyPlanStatus | undefined = "OPEN") =>
  async (): Promise<DailyPlan[] | undefined> => {
    const { data, errors } = await client.models.DailyPlan.listByStatus(
      { status },
      { sortDirection: "DESC", selectionSet }
    );
    if (errors) throw errors;
    if (!data) throw new Error("No daily tasks list fetched");
    try {
      return data.map(mapDailyPlan);
    } catch (error) {
      console.error("fetchDailyPlans", { error });
      throw error;
    }
  };

const useDailyPlans = (status?: DailyPlanStatus) => {
  const {
    data: dailyPlans,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/dailyplans/${status}`, fetchDailyPlans(status));

  const addTodoToDailyPlan = async (
    dailyPlanId: string,
    todo: DailyPlanTodo
  ) => {
    const updated = dailyPlans?.map((p) =>
      p.id !== dailyPlanId ? p : { ...p, todos: [...(p.todos ?? []), todo] }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanTodo.create({
      dailyPlanId,
      todoId: todo.todoId,
    });
    if (errors) handleApiErrors(errors, "Adding todo to daily plan failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const removeTodoFromDailyPlan = async (recordId: string) => {
    console.log("removeTodoFromDailyPlan", { recordId });
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) =>
      !p.todos.some((t) => t.recordId === recordId)
        ? p
        : { ...p, todos: p.todos.filter((t) => t.recordId !== recordId) }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanTodo.delete({
      id: recordId,
    });
    if (errors) handleApiErrors(errors, "Removing todo from daily plan failed");
    if (updated) mutate(updated);
    return data?.id;
  };

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
        todos: [],
      },
      ...(dailyPlans ?? []),
    ];
    mutate(updated, false);
    const { data, errors } = await client.models.DailyPlan.create({
      day: toISODateString(day),
      dayGoal,
      status: "PLANNING",
      context,
    });
    if (errors) handleApiErrors(errors, "Creating daily plan failed");
    if (!data) throw new Error("Creating daily plan returned no data");
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

  return {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    addTodoToDailyPlan,
    removeTodoFromDailyPlan,
    // finishDailyTaskList,
    // finishDailyTask,
  };
};

export default useDailyPlans;

/**
const useDailyPlans = (status?: DailyPlanStatus) => {
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
};
 */
