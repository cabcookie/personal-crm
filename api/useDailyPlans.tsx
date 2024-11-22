import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Context, useContextContext } from "@/contexts/ContextContext";
import { getTodos } from "@/helpers/dailyplans";
import {
  newDateString,
  newDateTimeString,
  toISODateString,
} from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import { map } from "lodash";
import { find, flow, get, identity } from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

type DailyPlanStatus = Schema["DailyPlanStatus"]["type"];

export type DailyPlanTodo = {
  recordId: string;
  todoId: string;
  todo: JSONContent;
  done: boolean;
  postPoned: boolean;
  projectIds: string[];
  activityId: string;
};

export type DailyPlanProject = {
  recordId: string;
  projectId: string;
  maybe: boolean;
};

export type DailyPlan = {
  id: string;
  day: Date;
  dayGoal: string;
  context: Context;
  status: DailyPlanStatus;
  todos: DailyPlanTodo[];
  projects: DailyPlanProject[];
};

const selectionSet = [
  "id",
  "day",
  "dayGoal",
  "context",
  "status",
  "projects.id",
  "projects.projectId",
  "projects.maybe",
  "todos.id",
  "todos.postPoned",
  "todos.todo.id",
  "todos.todo.todo",
  "todos.todo.status",
  "todos.todo.activity.type",
  "todos.todo.activity.activity.id",
  "todos.todo.activity.activity.forProjects.projectsId",
] as const;

export type DailyPlanData = SelectionSet<
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
  projects,
}) => ({
  id,
  day: new Date(day),
  dayGoal,
  context: context || "work",
  status,
  todos: getTodos(todos),
  projects: projects.map(({ id, projectId, maybe }) => ({
    recordId: id,
    projectId,
    maybe: !!maybe,
  })),
});

const fetchDailyPlans =
  (
    status: DailyPlanStatus | undefined = "OPEN",
    context: Context | undefined
  ) =>
  async (): Promise<DailyPlan[] | undefined> => {
    if (!context) return undefined;
    const { data, errors } = await client.models.DailyPlan.listByStatus(
      { status },
      {
        filter: { context: { eq: context } },
        sortDirection: "DESC",
        selectionSet,
      }
    );
    if (errors) throw errors;
    if (!data) throw new Error("No daily tasks list fetched");
    try {
      return map(data, mapDailyPlan);
    } catch (error) {
      console.error("fetchDailyPlans", { error });
      throw error;
    }
  };

const useDailyPlans = (status?: DailyPlanStatus) => {
  const { context } = useContextContext();
  const {
    data: dailyPlans,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `/api/dailyplans/${status}/${context}`,
    fetchDailyPlans(status, context)
  );
  const { toast } = useToast();

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
      updatedAt: newDateTimeString(),
    });
    if (errors) handleApiErrors(errors, "Adding todo to daily plan failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const removeTodoFromDailyPlan = async (recordId: string) => {
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

  const getDayplanProjectRecordId = async (
    dayPlanId: string,
    projectId: string
  ) => {
    const { data, errors } =
      await client.models.DailyPlanProject.listByProjectId(
        { projectId },
        {
          filter: {
            dailyPlanId: { eq: dayPlanId },
          },
          selectionSet: ["id"],
          sortDirection: "DESC",
        }
      );
    if (errors) handleApiErrors(errors, "Getting record id failed");
    if (!data) return;
    return data[0]?.id;
  };

  const removeProjectFromDayPlan = async (
    dayPlanId: string,
    projectId: string
  ) => {
    const updated = dailyPlans?.map((p) =>
      p.id !== dayPlanId
        ? p
        : {
            ...p,
            projects: p.projects.filter((t) => t.projectId !== projectId),
          }
    );
    if (updated) mutate(updated, false);
    const recordId = await getDayplanProjectRecordId(dayPlanId, projectId);
    if (!recordId) {
      if (updated) mutate(updated);
      return;
    }
    const { data, errors } = await client.models.DailyPlanProject.delete({
      id: recordId,
    });
    if (errors)
      handleApiErrors(errors, "Removing project from daily plan failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const updateMaybeOfProjectOnDayPlan = async (
    dayPlanId: string,
    recordId: string,
    maybe: boolean
  ) => {
    const updated = dailyPlans?.map((dp) =>
      dp.id !== dayPlanId
        ? dp
        : {
            ...dp,
            projects: dp.projects.map((p) =>
              p.recordId !== recordId ? p : { ...p, maybe }
            ),
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanProject.update({
      id: recordId,
      maybe,
    });
    if (errors)
      handleApiErrors(errors, "Updating maybe of project on daily plan failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const addProjectToDayPlan = async (
    dayPlanId: string,
    projectId: string,
    maybe: boolean = false
  ) => {
    const dayPlanProject = flow(
      identity<DailyPlan[] | undefined>,
      find(["id", dayPlanId]),
      get("projects"),
      find(["projectId", projectId])
    )(dailyPlans) as DailyPlanProject | undefined;
    if (dayPlanProject)
      return await updateMaybeOfProjectOnDayPlan(
        dayPlanId,
        dayPlanProject.recordId,
        maybe
      );
    const updated = dailyPlans?.map((p) =>
      p.id !== dayPlanId
        ? p
        : {
            ...p,
            projects: [
              ...p.projects,
              {
                recordId: crypto.randomUUID(),
                projectId,
                maybe,
              },
            ],
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanProject.create({
      dailyPlanId: dayPlanId,
      projectId,
      maybe,
      updatedAt: newDateTimeString(),
    });
    if (errors) handleApiErrors(errors, "Adding project to daily plan failed");
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
        projects: [],
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
    mutate(updated);
    return data?.id;
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

  const updateTodoStatus = async (todoId: string, newIsDone: boolean) => {
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) => ({
      ...p,
      todos: p.todos.map((t) =>
        t.todoId !== todoId
          ? t
          : {
              ...t,
              done: newIsDone,
            }
      ),
    }));
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.Todo.update({
      id: todoId,
      status: newIsDone ? "DONE" : "OPEN",
      doneOn: newIsDone ? newDateString() : null,
    });
    if (errors) handleApiErrors(errors, "Updating todo status failed");
    if (updated) mutate(updated);
    if (!data) return;
    return data.id;
  };

  const getDailyPlanTodoRecordId = async (
    dailyPlanId: string,
    todoId: string
  ) => {
    const { data, errors } = await client.models.DailyPlanTodo.listByTodoId(
      { todoId },
      {
        filter: {
          dailyPlanId: { eq: dailyPlanId },
        },
        selectionSet: ["id"],
        sortDirection: "DESC",
      }
    );
    if (errors)
      handleApiErrors(errors, "Getting daily plan todo record id failed");
    if (!data) return;
    return data[0]?.id;
  };

  const createPostponedTodo = async (
    dailyPlanId: string,
    todoId: string,
    newPostponedState: boolean
  ) => {
    const updated = dailyPlans?.map((p) =>
      p.id !== dailyPlanId
        ? p
        : {
            ...p,
            todos: p.todos.map((t) =>
              t.todoId !== todoId
                ? t
                : {
                    ...t,
                    postPoned: newPostponedState,
                  }
            ),
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanTodo.create({
      dailyPlanId,
      todoId,
      postPoned: newPostponedState,
      updatedAt: newDateTimeString(),
    });
    if (errors) handleApiErrors(errors, "Creating postponed todo failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const postponeTodo = async (
    dailyPlanId: string,
    todoId: string,
    newPostponedState: boolean
  ) => {
    const recordId = await getDailyPlanTodoRecordId(dailyPlanId, todoId);
    if (!recordId)
      return await createPostponedTodo(dailyPlanId, todoId, newPostponedState);

    const updated = dailyPlans?.map((p) =>
      p.id !== dailyPlanId
        ? p
        : {
            ...p,
            todos: p.todos.map((t) =>
              t.todoId !== todoId
                ? t
                : {
                    ...t,
                    postPoned: newPostponedState,
                  }
            ),
          }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlanTodo.update({
      id: recordId,
      postPoned: newPostponedState,
    });
    if (errors)
      handleApiErrors(errors, "Updating todo's postPoned state failed");
    if (updated) mutate(updated);
    return data?.id;
  };

  const updateDailyPlanStatus = async (
    dailyPlanId: string,
    status: "DONE" | "OPEN",
    defaultErrorMsg: string
  ) => {
    const updated: DailyPlan[] | undefined = dailyPlans?.map((p) =>
      p.id !== dailyPlanId ? p : { ...p, status }
    );
    if (updated) mutate(updated, false);
    const { data, errors } = await client.models.DailyPlan.update({
      id: dailyPlanId,
      status,
    });
    if (errors) handleApiErrors(errors, defaultErrorMsg);
    if (updated) mutate(updated);
    return data;
  };

  const handleUndoFinishDailyTaskList = (dailyPlanId: string) => async () => {
    const data = await updateDailyPlanStatus(
      dailyPlanId,
      "OPEN",
      "Undoing finishing daily todo list failed"
    );
    if (!data) return;
    toast({
      title: "Re-opened daily todo list",
      description: `Daily todo list “${data.dayGoal}” (${format(
        new Date(data.day),
        "PP"
      )}) is open again`,
    });
  };

  const finishDailyTaskList = async (dailyPlanId: string) => {
    const data = await updateDailyPlanStatus(
      dailyPlanId,
      "DONE",
      "Finishing todo list failed"
    );
    if (!data) return;
    toast({
      title: "Daily todo list completed",
      description: `You completed the daily todo list “${
        data.dayGoal
      }” (${format(new Date(data.day), "PP")})`,
      action: (
        <ToastAction
          altText="Undo finishing todo list"
          onClick={handleUndoFinishDailyTaskList(dailyPlanId)}
        >
          Undo
        </ToastAction>
      ),
    });
    return data.id;
  };

  return {
    dailyPlans,
    error,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    finishDailyTaskList,
    addTodoToDailyPlan,
    removeTodoFromDailyPlan,
    updateTodoStatus,
    postponeTodo,
    addProjectToDayPlan,
    removeProjectFromDayPlan,
  };
};

export default useDailyPlans;
