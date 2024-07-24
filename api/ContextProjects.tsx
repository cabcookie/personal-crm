import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import { addDaysToDate, toISODateString } from "@/helpers/functional";
import { calcPipeline } from "@/helpers/projects";
import {
  EditorJsonContent,
  emptyDocument,
  transformNotesVersion,
} from "@/helpers/ui-notes-writer";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { differenceInDays } from "date-fns";
import { filter, flow, get, join, map, sortBy } from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR, { KeyedMutator } from "swr";
import { handleApiErrors } from "./globals";
import { CRM_STAGES, TCrmStages } from "./useCrmProject";
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
    notes?: EditorJsonContent
  ) => Promise<string | undefined>;
  saveNextActions: (
    projectId: string,
    myNextActions: EditorJsonContent | string,
    othersNextActions: EditorJsonContent | string
  ) => Promise<string | undefined>;
  saveProjectName: (
    projectId: string,
    projectName: string
  ) => Promise<string | undefined>;
  saveProjectDates: (props: {
    projectId: string;
    dueDate?: Date;
    doneOn?: Date;
    onHoldTill?: Date | null;
  }) => Promise<string | undefined>;
  updateProjectState: (
    projectId: string,
    done: boolean
  ) => Promise<string | undefined>;
  addAccountToProject: (
    projectId: string,
    accountId: string
  ) => Promise<string | undefined>;
  removeAccountFromProject: (
    projectId: string,
    projectName: string,
    accountId: string,
    accountName: string
  ) => Promise<string | undefined>;
  updateProjectContext: (
    projectId: string,
    context: Context
  ) => Promise<string | undefined>;
  mutateProjects: KeyedMutator<Project[] | undefined>;
  getProjectNamesByIds: (projectIds?: string[]) => string;
  deleteLegacyNextActions: (projectId: string) => Promise<string | undefined>;
}

export type CrmProjectData = {
  id: string;
  arr: number;
  tcv: number;
  closeDate: Date;
  isMarketPlace: boolean;
  stage: TCrmStages;
};

export type Project = {
  id: string;
  project: string;
  done: boolean;
  order: number;
  pipeline: number;
  doneOn?: Date;
  dueOn?: Date;
  onHoldTill?: Date;
  myNextActions?: EditorJsonContent;
  othersNextActions?: EditorJsonContent;
  context: Context;
  accountIds: string[];
  activityIds: string[];
  crmProjects: CrmProjectData[];
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
  "formatVersion",
  "myNextActionsJson",
  "othersNextActionsJson",
  "context",
  "accounts.accountId",
  "accounts.createdAt",
  "activities.activity.id",
  "activities.activity.finishedOn",
  "activities.activity.createdAt",
  "crmProjects.crmProject.id",
  "crmProjects.crmProject.closeDate",
  "crmProjects.crmProject.isMarketplace",
  "crmProjects.crmProject.annualRecurringRevenue",
  "crmProjects.crmProject.totalContractVolume",
  "crmProjects.crmProject.stage",
] as const;

type ProjectData = SelectionSet<
  Schema["Projects"]["type"],
  typeof selectionSet
>;
export type CrmDataProps = ProjectData["crmProjects"][number];

export const mapCrmData = ({
  crmProject: {
    id,
    annualRecurringRevenue,
    totalContractVolume,
    closeDate,
    isMarketplace,
    stage,
  },
}: CrmDataProps): CrmProjectData => ({
  id,
  arr: annualRecurringRevenue || 0,
  tcv: totalContractVolume || 0,
  isMarketPlace: !!isMarketplace,
  closeDate: new Date(closeDate),
  stage: CRM_STAGES.find((s) => s === stage) || "Prospect",
});

const mapProject: (project: ProjectData) => Project = ({
  id,
  project,
  done,
  doneOn,
  dueOn,
  onHoldTill,
  myNextActions,
  othersNextActions,
  formatVersion,
  myNextActionsJson,
  othersNextActionsJson,
  context,
  accounts,
  activities,
  crmProjects,
}) => {
  const pipeline = calcPipeline([
    {
      projects: {
        crmProjects,
      },
    },
  ]);

  return {
    id,
    project,
    done: !!done,
    doneOn: doneOn ? new Date(doneOn) : undefined,
    dueOn: dueOn ? new Date(dueOn) : undefined,
    onHoldTill:
      onHoldTill && differenceInDays(onHoldTill, new Date()) >= 0
        ? new Date(onHoldTill)
        : undefined,
    myNextActions:
      !myNextActions && !myNextActionsJson
        ? undefined
        : transformNotesVersion({
            formatVersion,
            notes: myNextActions,
            notesJson: myNextActionsJson,
          }),
    othersNextActions:
      !othersNextActions && !othersNextActionsJson
        ? undefined
        : transformNotesVersion({
            formatVersion,
            notes: othersNextActions,
            notesJson: othersNextActionsJson,
          }),
    context,
    accountIds: flow(
      map((a: (typeof accounts)[number]) => ({
        accountId: a.accountId,
        createdAt: new Date(a.createdAt),
      })),
      sortBy((a) => -a.createdAt.getTime()),
      map((a) => a.accountId)
    )(accounts),
    activityIds: flow(
      filter((a: (typeof activities)[number]) => !!a.activity),
      map(({ activity: { id, createdAt, finishedOn } }) => ({
        id,
        finishedOn: new Date(finishedOn || createdAt),
      })),
      sortBy((a) => -a.finishedOn.getTime()),
      map((a) => a.id)
    )(activities),
    crmProjects: crmProjects.map(mapCrmData),
    pipeline: pipeline,
    order: pipeline,
  };
};

const fetchProjects = (context?: Context) => async () => {
  if (!context) return;
  const { data, errors } = await client.models.Projects.list({
    filter: {
      context: { eq: context },
      or: [
        { done: { ne: true } },
        {
          doneOn: {
            ge: flow(addDaysToDate(-90), toISODateString)(new Date()),
          },
        },
      ],
    },
    limit: 5000,
    selectionSet,
  });
  if (errors) {
    handleApiErrors(errors, "Error loading projects");
    throw errors;
  }
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
      context,
      accountIds: [],
      activityIds: [],
      crmProjects: [],
      pipeline: 0,
      order: 0,
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

  const createProjectActivity = async (projectId: string) => {
    const { data: activity, errors: errorsActivity } =
      await client.models.Activity.create({
        notesJson: JSON.stringify(emptyDocument),
        formatVersion: 2,
        hasOpenTasks: "false",
      });
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
    onHoldTill?: Date | null;
    myNextActions?: EditorJsonContent | string;
    othersNextActions?: EditorJsonContent | string;
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
    const updProject: Project | undefined = projects?.find((p) => p.id === id);
    if (!updProject) return;

    Object.assign(updProject, {
      ...(project && { project }),
      ...(done !== undefined && { done }),
      ...(doneOn && { doneOn }),
      ...(dueOn && { dueOn }),
      ...(onHoldTill && { onHoldTill }),
      ...(myNextActions && { myNextActions }),
      ...(othersNextActions && { othersNextActions }),
    });

    const updated: Project[] =
      projects?.map((p) => (p.id === id ? updProject : p)) || [];
    mutateProjects(updated, false);

    const newProject = {
      id,
      project,
      done,
      ...(myNextActions || othersNextActions
        ? {
            myNextActions: null,
            othersNextActions: null,
            formatVersion: 2,
            myNextActionsJson: JSON.stringify(updProject.myNextActions),
            othersNextActionsJson: JSON.stringify(updProject.othersNextActions),
          }
        : {}),
      dueOn: dueOn ? toISODateString(dueOn) : undefined,
      doneOn:
        done === undefined
          ? undefined
          : doneOn
          ? toISODateString(doneOn)
          : null,
      onHoldTill: onHoldTill ? toISODateString(onHoldTill) : undefined,
    };
    const { data, errors } = await client.models.Projects.update(newProject);
    if (errors) handleApiErrors(errors, "Error updating project");
    mutateProjects(updated);
    return data?.id;
  };

  const saveNextActions = (
    projectId: string,
    myNextActions: EditorJsonContent | string,
    othersNextActions: EditorJsonContent | string
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
    onHoldTill?: Date | null;
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

  const removeAccountFromProject = async (
    projectId: string,
    projectName: string,
    accountId: string,
    accountName: string
  ) => {
    const updated: Project[] | undefined = projects?.map((p) =>
      p.id !== projectId
        ? p
        : {
            ...p,
            accountIds: p.accountIds.filter((id) => id !== accountId),
          }
    );
    if (updated) mutateProjects(updated, false);

    const accProj =
      await client.models.AccountProjects.listAccountProjectsByProjectsId(
        { projectsId: projectId },
        { filter: { accountId: { eq: accountId } } }
      );
    if (accProj.errors)
      handleApiErrors(accProj.errors, "Error fetching account/project link");
    if (!accProj.data) return;
    const result = await client.models.AccountProjects.delete({
      id: accProj.data[0].id,
    });
    if (result.errors)
      handleApiErrors(result.errors, "Error deleting account/project link");

    if (updated) mutateProjects(updated);

    toast({
      title: "Removed account from project",
      description: `Removed account ${accountName} from project ${projectName}.`,
    });

    return result.data?.id;
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

  const getProjectNamesByIds = (projectIds?: string[]): string =>
    !projectIds || !projects
      ? ""
      : flow(
          filter((p: Project) => projectIds.includes(p.id)),
          map(get("project")),
          join(", ")
        )(projects);

  const deleteLegacyNextActions: (
    projectId: string
  ) => Promise<string | undefined> = async (projectId) => {
    const updated: Project[] | undefined = projects?.map((p) =>
      p.id !== projectId
        ? p
        : { ...p, myNextActions: undefined, othersNextActions: undefined }
    );
    if (updated) mutateProjects(updated, false);
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      othersNextActions: null,
      myNextActions: null,
      othersNextActionsJson: null,
      myNextActionsJson: null,
    });
    if (errors) handleApiErrors(errors, "Deleting Legacy Next Actions failed");
    if (updated) mutateProjects(updated);
    if (!data) return;
    toast({ title: "Legacy Next Actions deleted" });
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
        saveProjectName,
        saveProjectDates,
        updateProjectState,
        addAccountToProject,
        removeAccountFromProject,
        updateProjectContext,
        mutateProjects,
        getProjectNamesByIds,
        deleteLegacyNextActions,
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
