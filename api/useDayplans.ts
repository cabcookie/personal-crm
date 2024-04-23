import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import { Context } from "@/contexts/ContextContext";
import useSWR from "swr";
import { sortByDate } from "@/helpers/functional";
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
  day: string;
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

type DayPlanData = SelectionSet<Schema["DayPlan"], typeof dayplanSelectionSet>;

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
  day,
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

const fetchDayPlans = (context?: Context) => async () => {
  if (!context) return;
  const { data, errors } = await client.models.DayPlan.list({
    filter: { done: { ne: "true" }, context: { eq: context } },
    selectionSet: dayplanSelectionSet,
  });
  if (errors) throw errors;
  return data.map(mapDayPlan).sort((a, b) => sortByDate(true)([a.day, b.day]));
};

export type CreateTodoFn = (props: {
  todo: string;
  dayplanId: string;
  projectId?: string;
}) => Promise<Schema["DayPlanTodo"] | undefined>;

type SwitchTodoDoneFn = (todoId: string, done: boolean) => Promise<void>;

const useDayPlans = (context?: Context) => {
  const {
    data: dayPlans,
    error: errorDayPlans,
    isLoading: loadingDayPlans,
    mutate,
  } = useSWR(`/api/dayplans/${context}`, fetchDayPlans(context));

  const migrateLegacyTasks = async (dayPlanId: string) => {
    if (!context) return;
    const dayplan = dayPlans?.find(({ id }) => id === dayPlanId);
    if (!dayplan) return;
    console.log("Start migration...", dayPlanId, dayplan);
    const { projectTasks, nonprojectTasks } = dayplan;
    const updated = dayPlans?.map((dp) =>
      dp.id !== dayPlanId
        ? dp
        : {
            ...dp,
            projectTasks: [],
            nonprojectTasks: [],
            todos: [
              ...projectTasks.map(
                ({ todo, done, projectId, createdAt }): DayPlanTodo => ({
                  id: crypto.randomUUID(),
                  todo,
                  done,
                  createdAt,
                  projectId,
                })
              ),
              ...nonprojectTasks.map(
                ({ task, done, createdAt }): DayPlanTodo => ({
                  id: crypto.randomUUID(),
                  todo: task,
                  done,
                  createdAt,
                })
              ),
            ],
          }
    );
    mutate(updated, false);
    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      const { errors } = await client.models.DayPlanTodo.create({
        todo: task.todo,
        dayPlanTodosId: dayPlanId,
        done: task.done,
        projectsTodosId: task.projectId,
      });
      if (errors) console.error("DayPlanTodo.create", errors);
      if (!errors) {
        const { errors } = await client.models.DayProjectTask.delete({
          id: task.id,
        });
        if (errors) console.error("DayProjectTask.delete", errors);
      }
    }

    for (let i = 0; i < nonprojectTasks.length; i++) {
      const task = nonprojectTasks[i];
      const { errors } = await client.models.DayPlanTodo.create({
        todo: task.task,
        dayPlanTodosId: dayPlanId,
        done: task.done,
      });
      if (errors) console.error("DayPlanTodo.create", errors);
      if (!errors) {
        const { errors } = await client.models.NonProjectTask.delete({
          id: task.id,
        });
        if (errors) console.error("NonProjectTask.delete", errors);
      }
    }
    mutate(updated);
    console.log("Migration finished!");
  };

  const createDayPlan = async (
    day: string,
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
      day,
      dayGoal,
      done: false,
      context,
    });
    if (errors) handleApiErrors(errors, "Error creating day plan");
    mutate([{ ...newDayPlan, id: data.id }, ...(dayPlans || [])]);
  };

  const completeDayPlan = async (dayPlanId: string) => {
    const updatedDayPlans = dayPlans?.filter(({ id }) => id !== dayPlanId);
    mutate(updatedDayPlans, false);
    const { errors } = await client.models.DayPlan.update({
      id: dayPlanId,
      done: true,
    });
    if (errors) handleApiErrors(errors, "Error completing day plan");
    mutate(updatedDayPlans);
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
    return data;
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
    createTodo,
    switchTodoDone,
    migrateLegacyTasks,
  };
};

export default useDayPlans;
