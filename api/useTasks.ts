import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { handleApiErrors } from "./globals";
import useSWR from "swr";
import { mapNonProjectTask, mapProjectTask } from "./useTask";

const client = generateClient<Schema>();

const fetchProjectTasks = (dayPlanId: string) => async () => {
  const { data, errors } = await client.models.DayProjectTask.list({
    filter: { dayPlanProjectTasksId: { eq: dayPlanId } },
  });
  if (errors) throw errors;
  return data.map(mapProjectTask);
};

const fetchNonProjectTasks = (dayPlanId: string) => async () => {
  const { data, errors } = await client.models.NonProjectTask.list({
    filter: { dayPlanTasksId: { eq: dayPlanId } },
  });
  if (errors) throw errors;
  return data.map(mapNonProjectTask);
};

const useTasks = (dayPlanId: string) => {
  const {
    data: projectTasks,
    error: errorProjectTasks,
    isLoading: loadingProjectTasks,
    mutate: mutateProjectTasks,
  } = useSWR(`/api/projectTasks/${dayPlanId}`, fetchProjectTasks(dayPlanId));
  const {
    data: nonProjectTasks,
    error: errorNonProjectTasks,
    isLoading: loadingNonProjectTasks,
    mutate: mutateNonProjectTasks,
  } = useSWR(
    `/api/nonProjectTasks/${dayPlanId}`,
    fetchNonProjectTasks(dayPlanId)
  );

  const createTask =
    (dayPlanId: string, hideForm: () => void) =>
    async (task: string, projectId: string | null) => {
      const newTask = {
        id: crypto.randomUUID(),
        task,
        done: false,
      };

      if (!projectId) {
        const updatedTasks = [
          ...(nonProjectTasks || []),
          { ...newTask, projectId: undefined },
        ];
        mutateNonProjectTasks(updatedTasks, false);
        const { errors } = await client.models.NonProjectTask.create({
          task,
          done: false,
          dayPlanTasksId: dayPlanId,
        });
        if (errors) handleApiErrors(errors, "Error creating task in day plan");
        mutateNonProjectTasks(updatedTasks);
      } else {
        const updatedTasks = [
          ...(projectTasks || []),
          { ...newTask, projectId },
        ];
        mutateProjectTasks(updatedTasks, false);
        const { data, errors } = await client.models.DayProjectTask.create({
          task,
          done: false,
          dayPlanProjectTasksId: dayPlanId,
          projectsDayTasksId: projectId,
        });
        if (errors)
          handleApiErrors(errors, "Error creating task in day plan (project)");
        mutateProjectTasks(updatedTasks);
      }

      hideForm();
    };

  const switchProjectTaskDone = async (
    taskId: string,
    done?: boolean | null
  ) => {
    const newTasks = [
      ...(projectTasks?.map((task) =>
        task.id === taskId ? { ...task, done: !done } : task
      ) || []),
    ];
    mutateProjectTasks(newTasks, false);
    const newTask = {
      id: taskId,
      done: !done,
    };
    const { errors } = await client.models.DayProjectTask.update(newTask);
    if (errors) handleApiErrors(errors, "Error updating task status");
    mutateProjectTasks(newTasks);
  };

  return {
    tasks: [...(projectTasks || []), ...(nonProjectTasks || [])],
    errorTasks: errorProjectTasks || errorNonProjectTasks,
    loadingTasks: loadingProjectTasks || loadingNonProjectTasks,
    createTask,
    switchProjectTaskDone,
  };
};

export default useTasks;
