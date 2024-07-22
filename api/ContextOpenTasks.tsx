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
          openTask: task,
        })
      ),
    ];
    if (updated) mutate(updated, false);
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
