import { type Schema } from "@/amplify/data/resource";
import {
  EditorJsonContent,
  getAllTasks,
  transformNotesVersion,
} from "@/helpers/ui-notes-writer";
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
  task: EditorJsonContent;
  done: boolean;
  meetingId?: string;
  projectIds: string[];
  updatedAt: Date;
};

const selectionSet = [
  "id",
  "notes",
  "notesJson",
  "formatVersion",
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
  (tasks: EditorJsonContent[] | undefined) =>
    tasks?.map(
      (task, index): OpenTask => ({
        activityId: id,
        index,
        task,
        done: task.attrs?.checked,
        meetingId: meetingActivitiesId || undefined,
        projectIds: forProjects.map((p) => p.projectsId),
        updatedAt: new Date(updatedAt),
      })
    );

const mapOpenTasks: (openTasks: OpenTasksData) => OpenTask[] | undefined = (
  data
) => flow(transformNotesVersion, getAllTasks, mapToOpenTask(data))(data);

const fetchOpenTasks = async () => {
  const { data, errors } =
    await client.models.Activity.listActivitiesByOpenTasks(
      { hasOpenTasks: "true" },
      {
        sortDirection: "DESC",
        limit: 1000,
        selectionSet,
      }
    );

  if (errors) {
    handleApiErrors(errors, "Error loading open tasks");
    throw errors;
  }
  try {
    return flow(
      flatMap(mapOpenTasks),
      filter((t) => !!t)
    )(data);
  } catch (error) {
    console.error("fetchOpenTasks", { error });
    throw error;
  }
};

interface OpenTasksContextProviderProps {
  children: ReactNode;
}

export const OpenTasksContextProvider: FC<OpenTasksContextProviderProps> = ({
  children,
}) => {
  const { data: openTasks, mutate } = useSWR("/api/open-tasks", fetchOpenTasks);

  const mutateOpenTasks = (
    updatedTasks: EditorJsonContent[] | undefined,
    activity: Activity | undefined
  ) => {
    if (!activity) return;
    if (!updatedTasks) return;
    const updated: OpenTask[] | undefined = [
      ...(openTasks?.filter((t) => t.activityId !== activity.id) || []),
      ...updatedTasks.map(
        (task, index): OpenTask => ({
          activityId: activity.id,
          index,
          projectIds: activity.projectIds,
          updatedAt: new Date(),
          meetingId: activity.meetingId,
          task,
          done: task.attrs?.checked,
        })
      ),
    ];
    if (updated) mutate(updated, false);
  };

  const openTasksByProjectId: (projectId: string) => OpenTask[] = (projectId) =>
    flow(
      filter((t: OpenTask) => !t.done),
      filter((t: OpenTask) => t.projectIds.includes(projectId))
    )(openTasks) ?? [];

  const openTasksByMeetingId: (meetingId: string) => OpenTask[] = (meetingId) =>
    flow(
      filter((t: OpenTask) => !t.done),
      filter((t: OpenTask) => t.meetingId === meetingId)
    )(openTasks) ?? [];

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
