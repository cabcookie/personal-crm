import { type Schema } from "@/amplify/data/resource";
import { EditorJsonContent, transformTasks } from "@/helpers/ui-notes-writer";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { filter, flatMap, flow } from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR from "swr";
const client = generateClient<Schema>();

interface OpenTasksContextType {
  openTasks?: OpenTask[];
  openTasksByProjectId: (projectId: string) => OpenTask[];
}

export type OpenTask = {
  activityId: string;
  index: number;
  openTask?: EditorJsonContent;
  projectIds: string[];
  updatedAt: Date;
};

const selectionSet = [
  "id",
  "openTasks",
  "updatedAt",
  "forProjects.projectsId",
] as const;

type OpenTasksData = SelectionSet<
  Schema["Activity"]["type"],
  typeof selectionSet
>;

const mapToOpenTask =
  ({ id, forProjects, updatedAt }: OpenTasksData) =>
  (tasks: EditorJsonContent[]) =>
    tasks.map(
      (task, index): OpenTask => ({
        activityId: id,
        index,
        openTask: task,
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

  if (errors) throw errors;
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
  const { data: openTasks } = useSWR("/api/open-tasks", fetchOpenTasks);

  const openTasksByProjectId: (projectId: string) => OpenTask[] = (projectId) =>
    !openTasks ? [] : openTasks.filter((t) => t.projectIds.includes(projectId));

  return (
    <OpenTasksContext.Provider
      value={{
        openTasks,
        openTasksByProjectId,
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
