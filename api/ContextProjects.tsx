import { FC, ReactNode, createContext, useContext } from "react";
import { type Schema } from "@/amplify/data/resource";
import { SelectionSet, generateClient } from "aws-amplify/data";
import useSWR, { KeyedMutator } from "swr";
import { Context } from "@/contexts/ContextContext";
import { handleApiErrors } from "./globals";
import { addDaysToDate } from "@/helpers/functional";
const client = generateClient<Schema>();

interface ProjectsContextType {
  projects: Project[] | undefined;
  errorProjects: any;
  loadingProjects: boolean;
  createProject: (
    projectName: string
  ) => Promise<Schema["Projects"]["type"] | undefined>;
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
  saveProjectName: (
    projectId: string,
    projectName: string
  ) => Promise<string | undefined>;
  saveProjectDates: (props: {
    projectId: string;
    dueDate?: Date;
    doneOn?: Date;
    onHoldTill?: Date;
  }) => Promise<string | undefined>;
  updateProjectState: (
    projectId: string,
    done: boolean
  ) => Promise<string | undefined>;
  addAccountToProject: (
    projectId: string,
    accountId: string
  ) => Promise<string | undefined>;
  updateProjectContext: (
    projectId: string,
    context: Context
  ) => Promise<string | undefined>;
  mutateProjects: KeyedMutator<Project[] | undefined>;
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
  context: Context;
  accountIds: string[];
  activityIds: string[];
  crmProjectIds: string[];
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
  "accounts.createdAt",
  "activities.activity.id",
  "activities.activity.finishedOn",
  "activities.activity.createdAt",
  "crmProjects.crmProject.id",
] as const;

type ProjectData = SelectionSet<Schema["Projects"]["type"], typeof selectionSet>;

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
  crmProjects,
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
  accountIds: accounts
    .map(({ accountId, createdAt }) => ({
      accountId,
      createdAt: new Date(createdAt),
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(({ accountId }) => accountId),
  activityIds: activities
    .filter(({ activity }) => !!activity)
    .map(({ activity: { id, createdAt, finishedOn } }) => ({
      id,
      finishedOn: new Date(finishedOn || createdAt),
    }))
    .sort((a, b) => b.finishedOn.getTime() - a.finishedOn.getTime())
    .map(({ id }) => id),
  crmProjectIds: crmProjects.map(({ crmProject: { id } }) => id),
});

const fetchProjects = (context?: Context) => async () => {
  if (!context) return;
  const { data, errors } = await client.models.Projects.list({
    filter: {
      context: { eq: context },
      or: [
        { done: { ne: true }},
        {
          doneOn: {
            ge: addDaysToDate(-90)(new Date()).toISOString().split("T")[0],
          },
        },
      ],
    },
    limit: 5000,
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
    mutate: mutateProjects,
  } = useSWR(`/api/projects/${context}`, fetchProjects(context));

  const createProject = async (
    projectName: string
  ): Promise<Schema["Projects"]["type"] | undefined> => {
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
      crmProjectIds: [],
    };

    const updatedProjects = [...(projects || []), newProject];
    mutateProjects(updatedProjects, false);

    const { data, errors } = await client.models.Projects.create({
      context,
      project: projectName,
      done: false,
    });
    if (errors) handleApiErrors(errors, "Error creating project");
    mutateProjects(updatedProjects);
    return data || undefined;
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
    if (!activity) return;
    const updated: Project[] =
      projects?.map((project) =>
        project.id !== projectId
          ? project
          : { ...project, activityIds: [activity.id, ...project.activityIds] }
      ) || [];
    mutateProjects(updated, false);
    const { data, errors } = await client.models.ProjectActivity.create({
      activityId: activity.id,
      projectsId: projectId,
    });
    if (errors) handleApiErrors(errors, "Error linking activity with project");
    mutateProjects(updated);
    return data?.activityId;
  };

  type UpdateProjectProps = {
    id: string;
    project?: string;
    dueOn?: Date;
    doneOn?: Date | null;
    onHoldTill?: Date;
    myNextActions?: string;
    othersNextActions?: string;
    done?: boolean;
  };

  const updateProject = async ({
    id,
    project,
    done,
    doneOn,
    dueOn,
    onHoldTill,
    myNextActions,
    othersNextActions,
  }: UpdateProjectProps) => {
    const updated: Project[] =
      projects?.map((p) =>
        p.id !== id
          ? p
          : {
              ...p,
              project: !project ? p.project : project,
              done: done === undefined ? p.done : done,
              doneOn: !doneOn ? p.doneOn : doneOn,
              dueOn: !dueOn ? p.dueOn : dueOn,
              onHoldTill: !onHoldTill ? p.onHoldTill : onHoldTill,
              myNextActions: !myNextActions ? p.myNextActions : myNextActions,
              othersNextActions: !othersNextActions
                ? p.othersNextActions
                : othersNextActions,
            }
      ) || [];
    mutateProjects(updated, false);
    const newProject = {
      id,
      project,
      done,
      myNextActions,
      othersNextActions,
      dueOn: dueOn ? dueOn.toISOString().split("T")[0] : undefined,
      doneOn:
        done === undefined
          ? undefined
          : doneOn
          ? doneOn.toISOString().split("T")[0]
          : null,
      onHoldTill: onHoldTill
        ? onHoldTill.toISOString().split("T")[0]
        : undefined,
    };
    const { data, errors } = await client.models.Projects.update(newProject);
    if (errors) handleApiErrors(errors, "Error updating project");
    mutateProjects(updated);
    return data?.id;
  };

  const saveNextActions = (
    projectId: string,
    myNextActions: string,
    othersNextActions: string
  ) => updateProject({ id: projectId, myNextActions, othersNextActions });

  const saveProjectName = (projectId: string, projectName: string) =>
    updateProject({ id: projectId, project: projectName });

  const saveProjectDates = ({
    projectId,
    dueOn,
    doneOn,
    onHoldTill,
  }: {
    projectId: string;
    dueOn?: Date;
    doneOn?: Date;
    onHoldTill?: Date;
  }) => updateProject({ id: projectId, dueOn, onHoldTill, doneOn });

  const updateProjectState = (projectId: string, done: boolean) =>
    updateProject({ id: projectId, done, doneOn: done ? new Date() : null });

  const addAccountToProject = async (projectId: string, accountId: string) => {
    const updated: Project[] =
      projects?.map((p) =>
        p.id !== projectId
          ? p
          : { ...p, accountIds: [...p.accountIds, accountId] }
      ) || [];
    mutateProjects(updated, false);
    const { data, errors } = await client.models.AccountProjects.create({
      projectsId: projectId,
      accountId,
    });
    if (errors) handleApiErrors(errors, "Error adding account to project");
    mutateProjects(updated);
    return data?.id;
  };

  const updateProjectContext = async (
    projectId: string,
    newContext: Context
  ) => {
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      context: newContext,
    });
    if (errors) {
      handleApiErrors(errors, "Error updating project's context");
      return;
    }
    return data?.id;
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
        saveProjectName,
        saveProjectDates,
        updateProjectState,
        addAccountToProject,
        updateProjectContext,
        mutateProjects,
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
