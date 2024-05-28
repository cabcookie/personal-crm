import { type Schema } from "@/amplify/data/resource";
import { Context } from "@/contexts/ContextContext";
import { toISODateString } from "@/helpers/functional";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

type DayNonProjectTask = {
  id: string;
  task: string;
  done: boolean;
  createdAt: Date;
};

type DayProjectTask = {
  id: string;
  todo: string;
  done: boolean;
  createdAt: Date;
  projectId?: string;
};

export type DayPlanTodo = {
  id: string;
  todo: string;
  done: boolean;
  doneOn?: Date;
  createdAt: Date;
  projectId?: string;
};

type DayPlan = {
  id: string;
  day: Date;
  dayGoal: string;
  context: Context;
  done: boolean;
  todos: DayPlanTodo[];
  projectTasks: DayProjectTask[];
  nonprojectTasks: DayNonProjectTask[];
};

const dayplanSelectionSet = [
  "id",
  "day",
  "dayGoal",
  "context",
  "done",
  "projectTasks.id",
  "projectTasks.task",
  "projectTasks.done",
  "projectTasks.createdAt",
  "projectTasks.projects.id",
  "tasks.id",
  "tasks.task",
  "tasks.done",
  "tasks.createdAt",
  "todos.id",
  "todos.todo",
  "todos.done",
  "todos.doneOn",
  "todos.createdAt",
  "todos.project.id",
] as const;

type DayPlanData = SelectionSet<
  Schema["DayPlan"]["type"],
  typeof dayplanSelectionSet
>;

const mapDayPlan: (dayplan: DayPlanData) => DayPlan = ({
  id,
  day,
  dayGoal,
  context,
  done,
  tasks,
  projectTasks,
  todos,
}) => ({
  id,
  day: new Date(day),
  dayGoal,
  context: context || "work",
  done: !!done,
  todos: todos
    .map(({ id, todo, done, doneOn, createdAt, project }) => ({
      id,
      todo,
      done: !!done,
      createdAt: new Date(createdAt),
      doneOn: doneOn ? new Date(doneOn) : undefined,
      projectId: project?.id,
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  projectTasks: projectTasks
    .map(({ id, task, done, createdAt, projects }) => ({
      id,
      todo: task,
      done: !!done,
      createdAt: new Date(createdAt),
      projectId: projects.id,
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  nonprojectTasks: tasks
    .map(({ id, task, done, createdAt }) => ({
      id,
      task,
      done: !!done,
      createdAt: new Date(createdAt),
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
});

type FetchDayPlansWithTokenFn = (
  context: Context,
  token?: string
) => Promise<DayPlanData[] | undefined>;

const fetchDayPlansWithToken: FetchDayPlansWithTokenFn = async (
  context,
  token
) => {
  const { data, errors, nextToken } = await client.models.DayPlan.list({
    filter: { done: { ne: true }, context: { eq: context } },
    selectionSet: dayplanSelectionSet,
    nextToken: token,
  });
  if (errors) throw errors;
  if (!nextToken) return data;
  return [
    ...data,
    ...((await fetchDayPlansWithToken(context, nextToken)) || []),
  ];
};

const fetchDayPlans = (context?: Context) => async () => {
  if (!context) return;
  return (await fetchDayPlansWithToken(context))
    ?.map(mapDayPlan)
    .sort((a, b) => b.day.getTime() - a.day.getTime());
};

export type CreateTodoFn = (props: {
  todo: string;
  dayplanId: string;
  projectId?: string;
}) => Promise<Schema["DayPlanTodo"]["type"] | undefined>;

type SwitchTodoDoneFn = (todoId: string, done: boolean) => Promise<void>;

const checkForLegacyTasks = async (setCount: (count: number) => void) => {
  const { data: projectTasks, errors: projectTasksErrors } =
    await client.models.DayProjectTask.list({ limit: 40 });
  const { data: nonprojectTasks, errors: nonProjectTasksErrors } =
    await client.models.NonProjectTask.list({ limit: 40 });

  if (projectTasksErrors || nonProjectTasksErrors)
    console.error({ projectTasksErrors, nonProjectTasksErrors });

  setCount(projectTasks.length + nonprojectTasks.length);
};

const useDayPlans = (context?: Context) => {
  const {
    data: dayPlans,
    error: errorDayPlans,
    isLoading: loadingDayPlans,
    mutate,
  } = useSWR(`/api/dayplans/${context}`, fetchDayPlans(context));
  const [countLegacyTasks, setCountLegacyTasks] = useState(0);

  useEffect(() => {
    checkForLegacyTasks(setCountLegacyTasks);
  }, []);

  const migrateLegacyTasks = async () => {
    const { data: projectTasks, errors: projectTasksErrors } =
      await client.models.DayProjectTask.list({ limit: 40 });

    if (projectTasks) {
      console.log("Start migration of DayProjectTasks...", {
        projectTasks,
        projectTasksErrors,
      });
      for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i];
        const { errors } = await client.models.DayPlanTodo.create({
          todo: task.task,
          dayPlanTodosId: task.dayPlanProjectTasksId,
          done: task.done || false,
          projectsTodosId: task.projectsDayTasksId,
        });
        if (errors) console.error("DayPlanTodo.create", errors);
        if (!errors) {
          const { errors } = await client.models.DayProjectTask.delete({
            id: task.id,
          });
          if (errors) console.error("DayProjectTask.delete", errors);
        }
      }
      console.log("Finished migration of DayProjectTasks");
    } else {
      console.warn("No DayProjectTasks to migrate!", {
        projectTasks,
        projectTasksErrors,
      });
    }

    const { data: nonprojectTasks, errors: nonProjectTasksErrors } =
      await client.models.NonProjectTask.list({ limit: 40 });

    if (nonprojectTasks) {
      console.log("Start migration of NonProjectTasks...", {
        nonprojectTasks,
        nonProjectTasksErrors,
      });
      for (let i = 0; i < nonprojectTasks.length; i++) {
        const task = nonprojectTasks[i];
        const { errors } = await client.models.DayPlanTodo.create({
          todo: task.task,
          dayPlanTodosId: task.dayPlanTasksId,
          done: task.done || false,
        });
        if (errors) console.error("DayPlanTodo.create", errors);
        if (!errors) {
          const { errors } = await client.models.NonProjectTask.delete({
            id: task.id,
          });
          if (errors) console.error("NonProjectTask.delete", errors);
        }
      }
      console.log("Finished migration of NonProjectTasks");
    } else {
      console.warn("No DayProjectTasks to migrate!", {
        projectTasks,
        projectTasksErrors,
      });
    }
    mutate(dayPlans);
    checkForLegacyTasks(setCountLegacyTasks);
  };

  const createDayPlan = async (
    day: Date,
    dayGoal: string,
    context?: Context
  ) => {
    if (!context) return;
    const newDayPlan: DayPlan = {
      id: crypto.randomUUID(),
      day,
      dayGoal,
      done: false,
      context,
      todos: [],
      nonprojectTasks: [],
      projectTasks: [],
    };
    mutate([newDayPlan, ...(dayPlans || [])], false);
    const { data, errors } = await client.models.DayPlan.create({
      day: toISODateString(day),
      dayGoal,
      done: false,
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating day plan");
    if (!data) throw new Error("createDayPlan didn't return result data");
    mutate([{ ...newDayPlan, id: data.id }, ...(dayPlans || [])]);
  };

  const undoDayplanCompletion = async (dayplan: Schema["DayPlan"]["type"]) => {
    const updatedDayPlans: DayPlan[] = [
      ...(dayPlans?.filter(({ id }) => id !== dayplan.id) || []),
      {
        id: dayplan.id,
        context: dayplan.context,
        day: new Date(dayplan.day),
        dayGoal: dayplan.dayGoal,
        done: false,
        nonprojectTasks: [],
        projectTasks: [],
        todos: [],
      },
    ];
    mutate(updatedDayPlans, false);
    const { data, errors } = await client.models.DayPlan.update({
      id: dayplan.id,
      done: false,
    });
    if (errors) handleApiErrors(errors, "Error undoing completion of day plan");
    if (!data) return;
    mutate(updatedDayPlans);
    return data;
  };

  const completeDayPlan = async (dayPlanId: string) => {
    const updatedDayPlans = dayPlans?.filter(({ id }) => id !== dayPlanId);
    mutate(updatedDayPlans, false);
    const { data, errors } = await client.models.DayPlan.update({
      id: dayPlanId,
      done: true,
    });
    if (errors) handleApiErrors(errors, "Error completing day plan");
    if (!data) return;
    mutate(updatedDayPlans);
    return data;
  };

  const createTodo: CreateTodoFn = async ({ todo, dayplanId, projectId }) => {
    if (!context) return;
    const newTodo: DayPlanTodo = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      todo,
      done: false,
      projectId,
    };
    const updated = dayPlans?.map((dayplan) =>
      dayplan.id !== dayplanId
        ? dayplan
        : { ...dayplan, todos: [...dayplan.todos, newTodo] }
    );
    mutate(updated, false);
    const { data, errors } = await client.models.DayPlanTodo.create({
      todo,
      dayPlanTodosId: dayplanId,
      done: false,
      projectsTodosId: projectId,
    });
    if (errors) handleApiErrors(errors, "Error creating todo");
    mutate(updated);
    return data || undefined;
  };

  const switchTodoDone: SwitchTodoDoneFn = async (todoId, done) => {
    const updated = dayPlans?.map(({ todos, ...rest }) => ({
      ...rest,
      todos: todos.map((todo) =>
        todo.id !== todoId ? todo : { ...todo, done: !done }
      ),
    }));
    mutate(updated, false);
    const { errors } = await client.models.DayPlanTodo.update({
      id: todoId,
      done: !done,
    });
    if (errors) handleApiErrors(errors, "Error updating todo status");
    mutate(updated);
  };

  return {
    dayPlans,
    errorDayPlans,
    loadingDayPlans,
    createDayPlan,
    completeDayPlan,
    undoDayplanCompletion,
    createTodo,
    switchTodoDone,
    migrateLegacyTasks,
    countLegacyTasks,
  };
};

export default useDayPlans;
