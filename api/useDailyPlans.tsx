import { type Schema } from "@/amplify/data/resource";
import { handleApiErrors } from "@/api/globals";
import { useToast } from "@/components/ui/use-toast";
import { Context, useContextContext } from "@/contexts/ContextContext";
import { getTodos } from "@/helpers/dailyplans";
import { newDateTimeString, not, toISODateString } from "@/helpers/functional";
import { JSONContent } from "@tiptap/core";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { format } from "date-fns";
import { filter, find, flow, get, identity, map } from "lodash/fp";
import useSWR from "swr";
const client = generateClient<Schema>();

export type DailyPlanStatus = Schema["DailyPlanStatus"]["type"];

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
  createdAt: Date;
};

const selectionSet = [
  "id",
  "day",
  "dayGoal",
  "context",
  "status",
  "createdAt",
  "projects.id",
  "projects.projectId",
  "projects.project.done",
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
  createdAt,
}) => ({
  id,
  day: new Date(day),
  dayGoal,
  context: context || "work",
  status,
  todos: getTodos(todos),
  projects: flow(
    identity<typeof projects>,
    filter(flow(get("project.done"), not)),
    map(({ id, projectId, maybe }) => ({
      recordId: id,
      projectId,
      maybe: !!maybe,
    }))
  )(projects),
  createdAt: new Date(createdAt),
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
      return map(mapDailyPlan)(data);
    } catch (error) {
      console.error("fetchDailyPlans", { error });
      throw error;
    }
  };

const useDailyPlans = (status: DailyPlanStatus | undefined) => {
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
        createdAt: new Date(),
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

  return {
    dailyPlans,
    error,
    mutate,
    isLoading,
    createDailyPlan,
    confirmDailyPlanning,
    addProjectToDayPlan,
    removeProjectFromDayPlan,
  };
};

export default useDailyPlans;
