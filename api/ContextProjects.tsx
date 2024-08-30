import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import {
  addDaysToDate,
  newDateTimeString,
  toISODateString,
} from "@/helpers/functional";
import { calcPipeline } from "@/helpers/projects";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { JSONContent } from "@tiptap/core";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { differenceInDays } from "date-fns";
import { filter, flow, join, map, sortBy } from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR, { KeyedMutator } from "swr";
import { handleApiErrors } from "./globals";
import { CrmProject, mapCrmProject } from "./useCrmProjects";
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
    notes?: JSONContent
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
  updatePartnerOfProject: (
    projectId: string,
    partnerId: string | null
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

export type Project = {
  id: string;
  project: string;
  done: boolean;
  order: number;
  pipeline: number;
  doneOn?: Date;
  dueOn?: Date;
  onHoldTill?: Date;
  myNextActions?: JSONContent;
  othersNextActions?: JSONContent;
  context: Context;
  accountIds: string[];
  partnerId?: string;
  activityIds: string[];
  crmProjects: CrmProject[];
  hasOldVersionedActivityFormat: boolean;
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
  "partner.id",
  "activities.activity.id",
  "activities.activity.finishedOn",
  "activities.activity.formatVersion",
  "activities.activity.createdAt",
  "crmProjects.crmProject.id",
  "crmProjects.crmProject.name",
  "crmProjects.crmProject.crmId",
  "crmProjects.crmProject.annualRecurringRevenue",
  "crmProjects.crmProject.totalContractVolume",
  "crmProjects.crmProject.isMarketplace",
  "crmProjects.crmProject.closeDate",
  "crmProjects.crmProject.createdAt",
  "crmProjects.crmProject.createdDate",
  "crmProjects.crmProject.stage",
  "crmProjects.crmProject.opportunityOwner",
  "crmProjects.crmProject.nextStep",
  "crmProjects.crmProject.partnerName",
  "crmProjects.crmProject.type",
  "crmProjects.crmProject.stageChangedDate",
  "crmProjects.crmProject.accountName",
  "crmProjects.crmProject.territoryName",
] as const;

type ProjectData = SelectionSet<
  Schema["Projects"]["type"],
  typeof selectionSet
>;
export type CrmDataProps = ProjectData["crmProjects"][number];

const mapCrmData = ({ crmProject }: CrmDataProps): CrmProject | undefined =>
  !crmProject ? undefined : mapCrmProject({ ...crmProject, projects: [] });

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
  partner,
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
    crmProjects: flow(
      map(mapCrmData),
      filter((d) => !!d)
    )(crmProjects),
    pipeline: pipeline,
    order: pipeline,
    partnerId: partner?.id,
    hasOldVersionedActivityFormat: !activities
      ? false
      : activities
          .filter((a) => !!a.activity)
          .some(
            (a) => !a.activity?.formatVersion || a.activity.formatVersion < 3
          ),
  } as Project;
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
  try {
    return data.map(mapProject);
  } catch (error) {
    console.error("fetchProjects", { error });
    throw error;
  }
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
      hasOldVersionedActivityFormat: false,
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
        formatVersion: 3,
        noteBlockIds: [],
        finishedOn: newDateTimeString(),
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

  type UpdateProjectDates = {
    onHoldTill?: Date | null;
    doneOn?: Date | null;
    dueOn?: Date | null;
  };

  type UpdateProjectProps = Partial<
    Omit<Project, "id" | "onHoldTill" | "doneOn" | "dueOn">
  > &
    UpdateProjectDates & {
      id: string;
    };

  const updateProject = async ({
    id,
    project,
    done,
    doneOn,
    dueOn,
    onHoldTill,
  }: UpdateProjectProps) => {
    const updProject: Project | undefined = (() => {
      const project = projects?.find((p) => p.id === id);
      if (!project) return undefined;
      return { ...project } as Project;
    })();
    if (!updProject) return;

    Object.assign(updProject, {
      ...(project && { project }),
      ...(done !== undefined && { done }),
      ...(doneOn && { doneOn }),
      ...(dueOn && { dueOn }),
      ...(onHoldTill && { onHoldTill }),
    });

    const updated: Project[] =
      projects?.map((p) => (p.id === id ? updProject : p)) || [];

    mutateProjects(updated, false);

    const newProject = {
      id,
      project,
      done,
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

  const saveProjectName = (projectId: string, projectName: string) =>
    updateProject({ id: projectId, project: projectName });

  type SaveProjectDatesProps = UpdateProjectDates & {
    projectId: string;
  };

  const saveProjectDates = ({
    projectId,
    dueOn,
    doneOn,
    onHoldTill,
  }: SaveProjectDatesProps) =>
    updateProject({ id: projectId, dueOn, onHoldTill, doneOn });

  const updateProjectState = (projectId: string, done: boolean) =>
    updateProject({ id: projectId, done, doneOn: done ? new Date() : null });

  const addAccountToProject = async (projectId: string, accountId: string) => {
    const updated: Project[] | undefined = projects?.map((p) =>
      p.id !== projectId
        ? p
        : { ...p, accountIds: [...p.accountIds, accountId] }
    );
    if (updated) mutateProjects(updated, false);
    const { data, errors } = await client.models.AccountProjects.create({
      projectsId: projectId,
      accountId,
    });
    if (errors) handleApiErrors(errors, "Error adding account to project");
    if (updated) mutateProjects(updated);
    return data?.id;
  };

  const updatePartnerOfProject = async (
    projectId: string,
    partnerId: string | null
  ) => {
    const updated: Project[] | undefined = projects?.map((p) =>
      p.id !== projectId ? p : { ...p, partnerId: partnerId ?? undefined }
    );
    if (updated) mutateProjects(updated, false);
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      partnerId,
    });
    if (errors) handleApiErrors(errors, "Error assigning partner to project");
    if (updated) mutateProjects(updated);
    if (!data) return;
    toast({
      title: `Partner has been ${
        !partnerId ? "removed from" : "assigned to"
      } project`,
    });
    return data.id;
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
          filter((p) => !p.done),
          map("project"),
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
        saveProjectName,
        saveProjectDates,
        updateProjectState,
        addAccountToProject,
        updatePartnerOfProject,
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
  const projectsContext = useContext(ProjectsContext);
  if (!projectsContext)
    throw new Error(
      "useProjectsContext must be used within ProjectsContextProvider"
    );
  return projectsContext;
};
