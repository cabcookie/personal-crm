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
import { debounce } from "lodash";
const client = generateClient<Schema>();

// Global state for normalization scheduling
const normalizationPending = new Map<string, boolean>();

interface ProjectsContextType {
  projects: Project[] | undefined;
  errorProjects: any;
  loadingProjects: boolean;
  isNormalizing: boolean;
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
      console.log(`Starting order normalization for context: ${context}`);

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

        console.log(
          `Updated project "${project.project}" order from ${project.order} to ${newOrder}`
        );
      }

      // Sort the updated projects by their new order values
      const finalProjects = updatedProjects.sort((a, b) => a.order - b.order);

      // Update the local state with normalized order values
      mutateProjects(finalProjects);

      console.log(`Order normalization completed for context: ${context}`);
      toast({
        title: "Project order normalized",
        description: "Project order values have been cleaned up.",
      });
    } catch (error) {
      console.error("Error during order normalization:", error);
      toast({
        title: "Normalization failed",
        description:
          "Failed to normalize project order values. Please try again later.",
        variant: "destructive",
      });
    }
  },
  30000
);

/**
 * Detects projects that need legacy migration (no order values assigned)
 * @param projects Array of projects to analyze
 * @returns true if migration is needed (projects with null/undefined order)
 */
const detectLegacyMigrationNeeded = (projects: Project[]): boolean => {
  return projects.some((project) => project.order === 1000); // Default fallback value indicates no proper order assigned
};

/**
 * Migrates legacy projects by assigning proper order values based on current pipeline-based sorting
 * @param context The context for which to migrate projects
 * @param projects Current projects array
 * @param mutateProjects SWR mutate function for revalidation
 */
const migrateLegacyProjects = async (
  context: Context,
  projects: Project[],
  mutateProjects: KeyedMutator<Project[] | undefined>
) => {
  try {
    console.log(`Starting legacy project migration for context: ${context}`);

    // Filter projects that need migration (those with default order value 1000)
    const projectsNeedingMigration = projects.filter((p) => p.order === 1000);

    if (projectsNeedingMigration.length === 0) {
      console.log(`No projects need migration for context: ${context}`);
      return;
    }

    // Sort projects using the current pipeline-based logic to maintain existing visual order
    // This preserves the order users are accustomed to seeing
    const sortedProjects = [...projects].sort((a: Project, b: Project) => {
      // Primary sort: pipeline value (higher pipeline first)
      if (b.pipeline !== a.pipeline) {
        return b.pipeline - a.pipeline;
      }
      // Secondary sort: creation date (newer first) - using project ID as proxy
      return b.id.localeCompare(a.id);
    });

    // Assign sequential order values starting from 1
    const migratedProjects: Project[] = [];
    let orderCounter = 1;

    for (const project of sortedProjects) {
      if (project.order !== 1000) {
        // Project already has a proper order value, skip migration
        migratedProjects.push(project);
        continue;
      }

      // Update project order in database
      const { errors } = await client.models.Projects.update({
        id: project.id,
        order: orderCounter,
      });

      if (errors) {
        console.error(
          `Error migrating project order for ${project.id}:`,
          errors
        );
        handleApiErrors(
          errors,
          `Error migrating project order for ${project.project}`
        );
        // Continue with other projects even if one fails
        migratedProjects.push(project);
        continue;
      }

      // Update local project object
      const migratedProject = { ...project, order: orderCounter };
      migratedProjects.push(migratedProject);

      console.log(
        `Migrated project "${project.project}" to order ${orderCounter}`
      );

      orderCounter++;
    }

    // Update the local state with migrated order values
    const finalProjects = migratedProjects.sort(
      (a: Project, b: Project) => a.order - b.order
    );
    mutateProjects(finalProjects);

    console.log(
      `Legacy project migration completed for context: ${context}. Migrated ${projectsNeedingMigration.length} projects.`
    );

    toast({
      title: "Projects migrated",
      description: `${projectsNeedingMigration.length} projects have been assigned proper order values.`,
    });
  } catch (error) {
    console.error("Error during legacy project migration:", error);
    toast({
      title: "Migration failed",
      description: "Failed to migrate legacy projects. Please try again later.",
      variant: "destructive",
    });
  }
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
    // TODO: Clean up this function and remove console.log
    console.log("------------");
    return data
      .map(mapProject)
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        const { order, project } = item;
        console.info(order, project);
        return item;
      });
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

  // Check if normalization is currently in progress for this context
  const isNormalizing = context
    ? normalizationPending.get(context) || false
    : false;

  // Detect if legacy migration is needed and run it immediately
  // Migration runs before normalization to ensure all projects have proper order values
  if (projects && context && !loadingProjects && !isNormalizing) {
    const needsMigration = detectLegacyMigrationNeeded(projects);
    if (needsMigration) {
      // Run migration immediately (no debounce needed for migration)
      migrateLegacyProjects(context, projects, mutateProjects);
    } else {
      // Only check for normalization if migration isn't needed
      if (detectOrderNormalizationNeeded(projects))
        normalizeProjectOrders(context, projects, mutateProjects);
    }
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
    };

    const updatedProjects = [...(projects || []), newProject];
    mutateProjects(updatedProjects, false);

    const { data, errors } = await client.models.Projects.create({
      context,
      project: projectName,
      done: false,
      order: nextOrder,
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
    toast({ title: "Project moved up" });
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
    toast({ title: "Project moved down" });
    return data?.id;
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        errorProjects,
        loadingProjects,
        isNormalizing,
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
