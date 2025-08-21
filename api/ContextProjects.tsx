import { type Schema } from "@/amplify/data/resource";
import { ILeanActivity } from "@/components/activities/activity-lean";
import { toast } from "@/components/ui/use-toast";
import { Context } from "@/contexts/ContextContext";
import {
  addDaysToDate,
  toISODateString,
  uniqArraySorted,
} from "@/helpers/functional";
import { calcPipeline } from "@/helpers/projects";
import { transformNotesVersion } from "@/helpers/ui-notes-writer";
import { JSONContent } from "@tiptap/core";
import { SelectionSet, generateClient } from "aws-amplify/data";
import { differenceInDays } from "date-fns";
import {
  compact,
  filter,
  flatMap,
  flow,
  identity,
  join,
  map,
  sortBy,
} from "lodash/fp";
import { FC, ReactNode, createContext, useContext } from "react";
import useSWR, { KeyedMutator } from "swr";
import { handleApiErrors } from "./globals";
import {
  createActivityApi,
  createProjectActivityApi,
} from "./helpers/activity";
import { CrmProject, mapCrmProject } from "./useCrmProjects";
import { usePinnedProjects, PinnedProject } from "./usePinnedProjects";
import { debounce } from "lodash";
const client = generateClient<Schema>();

// Global state for normalization scheduling
const normalizationPending = new Map<string, boolean>();

interface ProjectsContextType {
  projects: Project[] | undefined;
  errorProjects: any;
  loadingProjects: boolean;
  isNormalizing: boolean;
  pinnedProjects: PinnedProject[] | undefined;
  errorPinnedProjects: any;
  loadingPinnedProjects: boolean;
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
  moveProjectUp: (
    projectId: string,
    newOrder?: number
  ) => Promise<string | undefined>;
  moveProjectDown: (
    projectId: string,
    newOrder?: number
  ) => Promise<string | undefined>;
  togglePinProject: (projectId: string) => Promise<string | undefined>;
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
  activities: ILeanActivity[];
  activityIds: string[];
  crmProjects: CrmProject[];
  hasOldVersionedActivityFormat: boolean;
  involvedPeopleIds: string[];
  pinned: Schema["ProjectPinned"]["type"];
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
  "order",
  "pinned",
  "accounts.accountId",
  "accounts.createdAt",
  "partner.id",
  "activities.activity.id",
  "activities.activity.createdAt",
  "activities.activity.finishedOn",
  "activities.activity.forProjects.projects.id",
  "activities.activity.meetingActivitiesId",
  "activities.activity.formatVersion",
  "activities.activity.forMeeting.participants.personId",
  "crmProjects.crmProject.id",
  "crmProjects.crmProject.name",
  "crmProjects.crmProject.crmId",
  "crmProjects.crmProject.annualRecurringRevenue",
  "crmProjects.crmProject.totalContractVolume",
  "crmProjects.crmProject.isMarketplace",
  "crmProjects.crmProject.closeDate",
  "crmProjects.crmProject.confirmHygieneIssuesSolvedTill",
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
  order,
  pinned,
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
    activities: flow(
      identity<typeof activities>,
      map("activity"),
      compact,
      map(
        ({
          id,
          finishedOn,
          createdAt,
          forProjects,
          meetingActivitiesId,
        }): ILeanActivity => ({
          id,
          finishedOn: new Date(finishedOn || createdAt),
          projectIds: forProjects.map((p) => p.projects.id),
          meetingId: meetingActivitiesId || undefined,
        })
      ),
      sortBy((a) => -a.finishedOn.getTime())
    )(activities),
    activityIds: flow(
      identity<typeof activities>,
      map("activity"),
      compact,
      map(({ id, createdAt, finishedOn }) => ({
        id,
        finishedOn: new Date(finishedOn || createdAt),
      })),
      sortBy((a) => -a.finishedOn.getTime()),
      map((a) => a.id)
    )(activities),
    involvedPeopleIds: flow(
      identity<ProjectData["activities"]>,
      map("activity.forMeeting"),
      compact,
      flatMap("participants"),
      map("personId"),
      uniqArraySorted
    )(activities),
    crmProjects: flow(
      map(mapCrmData),
      filter((d) => !!d)
    )(crmProjects),
    pipeline: pipeline,
    order: order ?? 1000,
    partnerId: partner?.id,
    hasOldVersionedActivityFormat: !activities
      ? false
      : activities
          .filter((a) => !!a.activity)
          .some(
            (a) => !a.activity?.formatVersion || a.activity.formatVersion < 3
          ),
    pinned,
  } as Project;
};

/**
 * Detects if project order values need normalization
 * @param projects Array of projects to analyze
 * @returns true if normalization is needed (non-sequential or non-integer orders)
 */
const detectOrderNormalizationNeeded = (projects: Project[]): boolean => {
  if (projects.length === 0) return false;

  // Sort projects by order to check sequence
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  for (let i = 0; i < sortedProjects.length; i++) {
    const order = sortedProjects[i].order;

    // Check if order is not an integer
    if (!Number.isInteger(order)) {
      return true;
    }

    // Check if order is not sequential (should be i + 1 for zero-based index)
    if (order !== i + 1) {
      return true;
    }
  }

  return false;
};

/**
 * Normalizes project order values to sequential integers (1, 2, 3, etc.)
 * @param context The context for which to normalize projects
 * @param projects Current projects array
 * @param mutateProjects SWR mutate function for revalidation
 */
const normalizeProjectOrders = debounce(
  async (
    context: Context,
    projects: Project[],
    mutateProjects: KeyedMutator<Project[] | undefined>
  ) => {
    try {
      // Sort projects by current order to maintain relative positions
      const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

      // Process projects from highest to lowest order to avoid conflicts
      // This ensures we don't accidentally assign an order value that's already in use
      const projectsToUpdate = sortedProjects.reverse();

      // Reassign sequential integer values starting from the highest needed value
      const updatedProjects: Project[] = [];

      for (let i = 0; i < projectsToUpdate.length; i++) {
        const project = projectsToUpdate[i];
        const newOrder = sortedProjects.length - i; // Assign from highest to lowest

        // Skip if project already has the correct order
        if (project.order === newOrder) {
          updatedProjects.push(project);
          continue;
        }

        // Update project order in database
        const { errors } = await client.models.Projects.update({
          id: project.id,
          order: newOrder,
        });

        if (errors) {
          console.error(
            `Error updating project order for ${project.id}:`,
            errors
          );
          handleApiErrors(
            errors,
            `Error normalizing project order for ${project.project}`
          );
          // Continue with other projects even if one fails
          updatedProjects.push(project);
          continue;
        }

        // Update local project object
        const updatedProject = { ...project, order: newOrder };
        updatedProjects.push(updatedProject);
      }

      // Sort the updated projects by their new order values
      const finalProjects = updatedProjects.sort((a, b) => a.order - b.order);

      // Update the local state with normalized order values
      mutateProjects(finalProjects);
    } catch (error) {
      console.error("Error during order normalization:", error);
      toast({
        title: "Error Project Ordering",
        description:
          "Failed to ordering projects. Will reload. Please check if you need to apply a change again.",
        variant: "destructive",
      });
      mutateProjects(projects);
    }
  },
  30000
);

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
    return data.map(mapProject).sort((a, b) => a.order - b.order);
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

  const {
    pinnedProjects,
    errorPinnedProjects,
    loadingPinnedProjects,
    mutatePinnedProjects,
  } = usePinnedProjects(context);

  // Check if normalization is currently in progress for this context
  const isNormalizing = context
    ? normalizationPending.get(context) || false
    : false;

  if (projects && context && !loadingProjects && !isNormalizing) {
    if (detectOrderNormalizationNeeded(projects))
      normalizeProjectOrders(context, projects, mutateProjects);
  }

  const createProject = async (
    projectName: string
  ): Promise<Schema["Projects"]["type"] | undefined> => {
    if (!context) return;
    if (projectName.length < 3) return;

    const nextOrder = 1000;

    const newProject: Project = {
      id: crypto.randomUUID(),
      project: projectName,
      done: false,
      context,
      accountIds: [],
      activities: [],
      activityIds: [],
      crmProjects: [],
      involvedPeopleIds: [],
      pipeline: 0,
      order: nextOrder,
      hasOldVersionedActivityFormat: false,
      pinned: "NOTPINNED",
    };

    const updatedProjects = [...(projects || []), newProject];
    mutateProjects(updatedProjects, false);

    const { data, errors } = await client.models.Projects.create({
      context,
      project: projectName,
      done: false,
      order: nextOrder,
      pinned: "NOTPINNED",
    });
    if (errors) handleApiErrors(errors, "Error creating project");
    mutateProjects(updatedProjects);
    return data || undefined;
  };

  const getProjectById = (projectId: string) =>
    projects?.find((project) => project.id === projectId);

  const createProjectActivity = async (projectId: string) => {
    const activity = await createActivityApi();
    if (!activity) return;
    const updated: Project[] =
      projects?.map((project) =>
        project.id !== projectId
          ? project
          : { ...project, activityIds: [activity.id, ...project.activityIds] }
      ) || [];
    mutateProjects(updated, false);
    const data = await createProjectActivityApi(projectId, activity.id);
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

  const moveProjectUp = async (
    projectId: string,
    newOrder?: number
  ): Promise<string | undefined> => {
    if (!projects || !context) return;

    const currentIndex = projects.findIndex((p) => p.id === projectId);

    if (currentIndex <= 0) return; // Already at the top or not found

    // Use provided newOrder or calculate new order value
    let calculatedOrder: number;
    if (newOrder !== undefined) {
      calculatedOrder = newOrder;
    } else {
      if (currentIndex === 1) {
        // Moving to first position
        calculatedOrder = projects[0].order - 0.5;
      } else {
        const firstProject = projects[currentIndex - 2];
        const secondProject = projects[currentIndex - 1];
        calculatedOrder = (firstProject.order + secondProject.order) / 2;
      }
    }

    // Optimistic UI update
    const updated: Project[] = projects
      .map((p) => (p.id === projectId ? { ...p, order: calculatedOrder } : p))
      .sort((a, b) => a.order - b.order);

    mutateProjects(updated, false);

    // Update database
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      order: calculatedOrder,
    });

    if (errors) {
      handleApiErrors(errors, "Error moving project up");
      // Revert optimistic update on error
      mutateProjects(projects);
      return;
    }

    mutateProjects(updated);
    return data?.id;
  };

  const moveProjectDown = async (
    projectId: string,
    newOrder?: number
  ): Promise<string | undefined> => {
    if (!projects || !context) return;

    const currentIndex = projects.findIndex((p) => p.id === projectId);

    if (currentIndex === -1 || currentIndex >= projects.length - 1) return; // Not found or already at the bottom

    // Use provided newOrder or calculate new order value
    let calculatedOrder: number;
    if (newOrder !== undefined) {
      calculatedOrder = newOrder;
    } else {
      if (currentIndex === projects.length - 2) {
        // Moving to last position
        calculatedOrder = projects[currentIndex + 1].order + 1;
      } else {
        // Moving between two projects - calculate midpoint
        const firstProject = projects[currentIndex + 1];
        const secondProject = projects[currentIndex + 2];
        calculatedOrder = (firstProject.order + secondProject.order) / 2;
      }
    }

    // Optimistic UI update
    const updated: Project[] = projects
      .map((p) => (p.id === projectId ? { ...p, order: calculatedOrder } : p))
      .sort((a, b) => a.order - b.order);

    mutateProjects(updated, false);

    // Update database
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      order: calculatedOrder,
    });

    if (errors) {
      handleApiErrors(errors, "Error moving project down");
      // Revert optimistic update on error
      mutateProjects(projects);
      return;
    }

    mutateProjects(updated);
    return data?.id;
  };

  const togglePinProject = async (
    projectId: string
  ): Promise<string | undefined> => {
    if (!projects) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newPinnedState: Schema["ProjectPinned"]["type"] =
      project.pinned === "PINNED" ? "NOTPINNED" : "PINNED";

    // Optimistic UI update for projects list
    const updatedProjects = projects.map((p) =>
      p.id === projectId ? { ...p, pinned: newPinnedState } : p
    );
    mutateProjects(updatedProjects, false);

    // Optimistic UI update for pinned projects list
    if (pinnedProjects) {
      let updatedPinnedProjects;
      if (newPinnedState === "PINNED") {
        // Add to pinned list
        const projectToPinAsAny = project as any;
        updatedPinnedProjects = [
          ...pinnedProjects,
          projectToPinAsAny as PinnedProject,
        ];
      } else {
        // Remove from pinned list
        updatedPinnedProjects = pinnedProjects.filter(
          (p) => p.id !== projectId
        );
      }
      mutatePinnedProjects(updatedPinnedProjects, false);
    }

    // Update database
    const { data, errors } = await client.models.Projects.update({
      id: projectId,
      pinned: newPinnedState,
    });

    if (errors) {
      handleApiErrors(errors, "Error toggling project pin");
      // Revert optimistic updates on error
      mutateProjects(projects);
      mutatePinnedProjects(pinnedProjects);
      return;
    }

    // Revalidate both lists to ensure consistency
    mutateProjects(updatedProjects);
    mutatePinnedProjects();

    return data?.id;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        errorProjects,
        loadingProjects,
        isNormalizing,
        pinnedProjects,
        errorPinnedProjects,
        loadingPinnedProjects,
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
        moveProjectUp,
        moveProjectDown,
        togglePinProject,
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
