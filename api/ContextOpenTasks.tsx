import { type Schema } from "@/amplify/data/resource";
import { EditorJsonContent, transformTasks } from "@/helpers/ui-notes-writer";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { filter, flatMap, flow } from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { Activity } from "./useActivity";
const client = generateClient<Schema>();

interface OpenTasksContextType {
  openTasks?: OpenTask[];
  openTasksByProjectId: (projectId: string) => OpenTask[];
  openTasksByMeetingId: (meetingId: string) => OpenTask[];
  mutateOpenTasks: (
    updatedOpenTasks: EditorJsonContent[] | undefined,
    activity: Activity | undefined
  ) => void;
}

export type OpenTask = {
  activityId: string;
  index: number;
  openTask?: EditorJsonContent;
  meetingId?: string;
  projectIds: string[];
  updatedAt: Date;
};

const selectionSet = [
  "id",
  "openTasks",
  "updatedAt",
  "meetingActivitiesId",
  "forProjects.projectsId",
] as const;

type OpenTasksData = SelectionSet<
  Schema["Activity"]["type"],
  typeof selectionSet
>;

const mapToOpenTask =
  ({ id, forProjects, updatedAt, meetingActivitiesId }: OpenTasksData) =>
  (tasks: EditorJsonContent[]) =>
    tasks.map(
      (task, index): OpenTask => ({
        activityId: id,
        index,
        openTask: task,
        meetingId: meetingActivitiesId || undefined,
        projectIds: forProjects.map((p) => p.projectsId),
        updatedAt: new Date(updatedAt),
      })
    );

const mapOpenTasks: (openTasks: OpenTasksData) => OpenTask[] | undefined = (
  data
) => flow(transformTasks, mapToOpenTask(data))(data.openTasks);

const fetchOpenTasks = async () => {
  const { data, errors } =
    await client.models.Activity.listActivityByHasOpenTasks(
      { hasOpenTasks: "true" },
      {
        limit: 1000,
        selectionSet,
      }
    );

  if (errors) {
    handleApiErrors(errors, "Error loading open tasks");
    throw errors;
  }
  return flow(
    flatMap(mapOpenTasks),
    filter((t) => !!t)
  )(data);
};

interface OpenTasksContextProviderProps {
  children: ReactNode;
}

export const OpenTasksContextProvider: FC<OpenTasksContextProviderProps> = ({
  children,
}) => {
  const { data: openTasks, mutate } = useSWR("/api/open-tasks", fetchOpenTasks);

  const mapUpdatedOpenTask =
    (activity: Activity) =>
    (task: EditorJsonContent, index: number): OpenTask => ({
      activityId: activity.id,
      index,
      projectIds: activity.projectIds,
      meetingId: activity.meetingId,
      openTask: task,
      updatedAt: new Date(),
    });

  const mutateOpenTasks = (
    updatedTasks: EditorJsonContent[] | undefined,
    activity: Activity | undefined
  ) => {
    if (!activity) return;
    if (!updatedTasks) return;
    if (!openTasks) {
      mutate(updatedTasks.map(mapUpdatedOpenTask(activity)), false);
      return;
    }
    const newTasks: OpenTask[] = updatedTasks.map(mapUpdatedOpenTask(activity));
    let hasUpdated = false;

    const taskMap = new Map<string, OpenTask>();
    openTasks.forEach((task) => {
      const key = `${task.activityId}-${task.index}`;
      taskMap.set(key, task);
    });

    newTasks.forEach((newTask) => {
      const key = `${newTask.activityId}-${newTask.index}`;
      const existingTask = taskMap.get(key);

      if (
        !existingTask ||
        JSON.stringify(existingTask.openTask) !==
          JSON.stringify(newTask.openTask)
      ) {
        taskMap.set(key, newTask);
        hasUpdated = true;
      }
    });

    openTasks.forEach((task) => {
      const key = `${task.activityId}-${task.index}`;
      if (
        !newTasks.some(
          (newTask) =>
            newTask.activityId === task.activityId &&
            newTask.index === task.index
        )
      ) {
        taskMap.delete(key);
        hasUpdated = true;
      }
    });

    if (hasUpdated) {
      mutate(Array.from(taskMap.values()), false);
    }
  };

  const openTasksByProjectId: (projectId: string) => OpenTask[] = (projectId) =>
    openTasks?.filter((t) => t.projectIds.includes(projectId)) ?? [];

  const openTasksByMeetingId: (meetingId: string) => OpenTask[] = (meetingId) =>
    openTasks?.filter((t) => t.meetingId === meetingId) ?? [];

  return (
    <OpenTasksContext.Provider
      value={{
        openTasks,
        openTasksByProjectId,
        openTasksByMeetingId,
        mutateOpenTasks,
      }}
    >
      {children}
    </OpenTasksContext.Provider>
  );
};

const OpenTasksContext = createContext<OpenTasksContextType | undefined>(
  undefined
);

export const useOpenTasksContext = () => {
  const projects = useContext(OpenTasksContext);
  if (!projects)
    throw new Error(
      "useOpenTasksContext must be used within OpenTasksContextProvider"
    );
  return projects;
};
