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
  createProjectActivity: (
    projectId: string,
    notes?: string
  ) => Promise<string | undefined>;
  saveNextActions: (
    projectId: string,
    myNextActions: string,
    othersNextActions: string
  ) => Promise<string | undefined>;
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
  "accounts.accountId",
  "activities.activity.id",
  "activities.activity.finishedOn",
  "activities.activity.createdAt",
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
  accountIds: accounts.map(({ accountId }) => accountId),
  activityIds: activities
    .filter(({ activity }) => !!activity)
    .map(({ activity: { id, createdAt, finishedOn } }) => ({
      id,
      finishedOn: new Date(finishedOn || createdAt),
    }))
    .sort((a, b) => b.finishedOn.getTime() - a.finishedOn.getTime())
    .map(({ id }) => id),
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

  const createProjectActivity = async (projectId: string, notes?: string) => {
    const { data: activity, errors: errorsActivity } =
      await client.models.Activity.create({ notes });
    if (errorsActivity) {
      handleApiErrors(errorsActivity, "Error creating activity");
      return;
    }
    const updated: Project[] =
      projects?.map((project) =>
        project.id !== projectId
          ? project
          : { ...project, activityIds: [activity.id, ...project.activityIds] }
      ) || [];
    mutate(updated, false);
    const { data, errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors) handleApiErrors(errors, "Error linking activity with project");
    mutate(updated);
    return data.activityId;
  };

  const saveNextActions = async (
    projectId: string,
    myNextActions: string,
    othersNextActions: string
  ) => {
    const updated: Project[] =
      projects?.map((project) =>
        project.id !== projectId
          ? project
          : { ...project, myNextActions, othersNextActions }
      ) || [];

    mutate(updated, false);
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      myNextActions,
      othersNextActions,
    });
    if (errors) handleApiErrors(errors, "Error saving project's next actions");
    mutate(updated);
    return data.id;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        errorProjects,
        loadingProjects,
        createProject,
        getProjectById,
        createProjectActivity,
        saveNextActions,
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
