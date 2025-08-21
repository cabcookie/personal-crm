import { type Schema } from "@/amplify/data/resource";
import { ILeanActivity } from "@/components/activities/activity-lean";
import { Context } from "@/contexts/ContextContext";
import { uniqArraySorted } from "@/helpers/functional";
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
  map,
  sortBy,
} from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { CrmProject, mapCrmProject } from "./useCrmProjects";

const client = generateClient<Schema>();

export type PinnedProject = {
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
  pinned: "PINNED" | "NOTPINNED";
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

type PinnedProjectData = SelectionSet<
  Schema["Projects"]["type"],
  typeof selectionSet
>;

export type CrmDataProps = PinnedProjectData["crmProjects"][number];

const mapCrmData = ({ crmProject }: CrmDataProps): CrmProject | undefined =>
  !crmProject ? undefined : mapCrmProject({ ...crmProject, projects: [] });

const mapPinnedProject: (project: PinnedProjectData) => PinnedProject = ({
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
      identity<PinnedProjectData["activities"]>,
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
  } as PinnedProject;
};

const fetchPinnedProjects = (context?: Context) => async () => {
  if (!context) return;
  const { data, errors } = await client.models.Projects.listByPinnedState(
    { pinned: "PINNED" },
    {
      filter: {
        context: { eq: context },
      },
      limit: 5000,
      selectionSet,
    }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading pinned projects");
    throw errors;
  }
  try {
    return data.map(mapPinnedProject).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("fetchPinnedProjects", { error });
    throw error;
  }
};

export const usePinnedProjects = (context?: Context) => {
  const {
    data: pinnedProjects,
    error: errorPinnedProjects,
    isLoading: loadingPinnedProjects,
    mutate: mutatePinnedProjects,
  } = useSWR(`/api/pinned-projects/${context}`, fetchPinnedProjects(context));

  return {
    pinnedProjects,
    errorPinnedProjects,
    loadingPinnedProjects,
    mutatePinnedProjects,
  };
};
