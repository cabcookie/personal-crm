import { FC, ReactNode, createContext, useContext } from "react";
import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { Context } from "@/contexts/ContextContext";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

interface ProjectsContextType {
  projects: Project[] | undefined;
  errorProjects: any;
  loadingProjects: boolean;
  createProject: (
    projectName: string
  ) => Promise<Schema["Projects"] | undefined>;
  getProjectById: (projectId: string) => Project | undefined;
  getProjectsByActivityId: (activityId: string) => Project[] | undefined;
}

export type Project = {
  id: string;
  project: string;
  done: boolean;
  doneOn?: Date;
  dueOn?: Date;
  onHoldTill?: Date;
  myNextActions: string;
  othersNextActions: string;
  context?: Context;
  accountIds: string[];
  activityIds: string[];
};

const selectionSet = [
  "id",
  "project",
  "done",
  "doneOn",
  "dueOn",
  "onHoldTill",
  "myNextActions",
  "othersNextActions",
  "context",
  "accounts.account.id",
  "activities.activity.id",
] as const;

type ProjectData = SelectionSet<Schema["Projects"], typeof selectionSet>;

export const mapProject: (project: ProjectData) => Project = ({
  id,
  project,
  done,
  doneOn,
  dueOn,
  onHoldTill,
  myNextActions,
  othersNextActions,
  context,
  accounts,
  activities,
}) => ({
  id,
  project,
  done: !!done,
  doneOn: doneOn ? new Date(doneOn) : undefined,
  dueOn: dueOn ? new Date(dueOn) : undefined,
  onHoldTill: onHoldTill ? new Date(onHoldTill) : undefined,
  myNextActions: myNextActions || "",
  othersNextActions: othersNextActions || "",
  context,
  accountIds: accounts?.map(({ account: { id } }) => id) || [],
  activityIds: activities?.map(({ activity: { id } }) => id) || [],
});

const fetchProjects = (context?: Context) => async () => {
  if (!context) return;
  const { data, errors } = await client.models.Projects.list({
    filter: { context: { eq: context }, done: { ne: "true" } },
    limit: 500,
    selectionSet,
  });
  if (errors) throw errors;
  return data.map(mapProject);
};

interface ProjectsContextProviderProps {
  children: ReactNode;
  context?: Context;
}

export const ProjectsContextProvider: FC<ProjectsContextProviderProps> = ({
  children,
  context,
}) => {
  const {
    data: projects,
    error: errorProjects,
    isLoading: loadingProjects,
    mutate,
  } = useSWR(`/api/projects/${context}`, fetchProjects(context));

  const createProject = async (
    projectName: string
  ): Promise<Schema["Projects"] | undefined> => {
    if (!context) return;
    if (projectName.length < 3) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      project: projectName,
      done: false,
      myNextActions: "",
      othersNextActions: "",
      context,
      accountIds: [],
      activityIds: [],
    };

    const updatedProjects = [...(projects || []), newProject];
    mutate(updatedProjects, false);

    const { data, errors } = await client.models.Projects.create({
      context,
      project: projectName,
      done: false,
    });
    if (errors) handleApiErrors(errors, "Error creating project");
    mutate(updatedProjects);
    return data;
  };

  const getProjectById = (projectId: string) =>
    projects?.find((project) => project.id === projectId);

  const getProjectsByActivityId = (activityId: string) =>
    projects?.filter((project) => project.activityIds.includes(activityId));

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        errorProjects,
        loadingProjects,
        createProject,
        getProjectById,
        getProjectsByActivityId,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const useProjectsContext = () => {
  const projects = useContext(ProjectsContext);
  if (!projects)
    throw new Error(
      "useProjectsContext must be used within ProjectsContextProvider"
    );
  return projects;
};
