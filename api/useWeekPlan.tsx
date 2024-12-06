import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { toISODateString } from "@/helpers/functional";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { addDays, format } from "date-fns";
import { filter, flow, union } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const _WEEK_PLAN_STATUS = ["WIP", "DONE", "CANCELLED"];
type TWeekPlanStatus = (typeof _WEEK_PLAN_STATUS)[number];

export type WeeklyPlan = {
  id: string;
  startDate: Date;
  status: TWeekPlanStatus;
  projectIds: string[];
};

const selectionSet = [
  "id",
  "startDate",
  "status",
  "projects.projectId",
] as const;

type WeeklyPlanData = SelectionSet<
  Schema["WeeklyPlan"]["type"],
  typeof selectionSet
>;

const mapWeekPlan: (data: WeeklyPlanData) => WeeklyPlan = ({
  id,
  startDate,
  status,
  projects,
}) => ({
  id,
  startDate: new Date(startDate),
  status,
  projectIds: projects.map(({ projectId }) => projectId),
});

const fetchWeekPlans = async () => {
  const { data, errors } =
    await client.models.WeeklyPlan.listWeeklyPlanByStatus(
      { status: "WIP" },
      { selectionSet, limit: 1000 }
    );
  if (errors) {
    handleApiErrors(errors, "Error loading weekly planning");
    throw errors;
  }
  if (!data) throw new Error("fetchWeekPlan didn't retrieve data");
  try {
    return data.map(mapWeekPlan);
  } catch (error) {
    console.error("fetchWeekPlans", { error });
    throw error;
  }
};

const useWeekPlan = () => {
  const {
    data: weekPlans,
    mutate,
    isLoading,
    error,
  } = useSWR("/api/planweek", fetchWeekPlans);

  const createWeekPlan = async (startDate: Date) => {
    const updated: WeeklyPlan[] = [
      { id: crypto.randomUUID(), startDate, status: "WIP", projectIds: [] },
    ];
    mutate(updated, false);
    if (weekPlans && weekPlans.length > 0) {
      await Promise.all(
        weekPlans.map(async ({ id }) => {
          const { data, errors } = await client.models.WeeklyPlan.update({
            id,
            status: "CANCELLED",
          });
          if (errors) handleApiErrors(errors, "Cleaning up week plans failed");
          return data?.id;
        })
      );
    }
    const { data, errors } = await client.models.WeeklyPlan.create({
      startDate: toISODateString(startDate),
      status: "WIP",
    });
    if (errors) handleApiErrors(errors, "Creating week plan failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "Weekly Planning started",
      description: `Planning started for week starting ${format(
        startDate,
        "PP"
      )}. Select the projects you would like to work on.`,
    });
  };

  const confirmProjectSelection = async () => {
    if (!weekPlans || weekPlans.length === 0) return;
    mutate([], false);
    const { data, errors } = await client.models.WeeklyPlan.update({
      id: weekPlans[0].id,
      status: "DONE",
    });
    if (errors) handleApiErrors(errors, "Confirm project selection failed");
    mutate([]);
    return data?.id;
  };

  const removeExistingWeeklyPlanProject = async (projectId: string) => {
    if (!weekPlans) return;
    const { data: weekPlanProject, errors: errorsFetching } =
      await client.models.WeeklyPlanProject.list({
        filter: {
          projectId: { eq: projectId },
          weekPlanId: { eq: weekPlans[0].id },
        },
      });
    if (errorsFetching)
      handleApiErrors(
        errorsFetching,
        "Couldn't retrieve existing project dependency for weekly plan"
      );
    if (!weekPlanProject) return;
    await Promise.all(
      weekPlanProject.map(async ({ id }) => {
        const { errors } = await client.models.WeeklyPlanProject.delete({ id });
        if (errors)
          handleApiErrors(
            errors,
            "Deleting week plan/project relationship failed"
          );
      })
    );
  };

  interface Project {
    id: string;
    onHoldTill?: Date | null;
  }

  type MakeProjectDecisionProps = {
    inFocusThisWeek: boolean;
    project: Project;
    saveOnHoldDate: (onHoldTill: Date | null) => void;
  };

  const makeProjectDecision = async ({
    inFocusThisWeek,
    project,
    saveOnHoldDate,
  }: MakeProjectDecisionProps) => {
    if (!weekPlans) return;
    const updated: WeeklyPlan[] = [
      {
        ...weekPlans[0],
        projectIds: flow(
          filter((id) => inFocusThisWeek || id !== project.id),
          union(inFocusThisWeek ? [project.id] : [])
        )(weekPlans[0].projectIds),
      },
    ];
    mutate(updated, false);
    if (!inFocusThisWeek) await removeExistingWeeklyPlanProject(project.id);
    if (inFocusThisWeek && project.onHoldTill) await saveOnHoldDate(null);

    if (inFocusThisWeek) {
      const { data, errors } = await client.models.WeeklyPlanProject.create({
        projectId: project.id,
        weekPlanId: weekPlans[0].id,
      });
      if (errors)
        handleApiErrors(errors, "Document focus for this week failed");
      mutate(updated);
      if (!data) return;
      toast({
        title: "Documented project focus status for this week",
        description: `Project is ${inFocusThisWeek ? "" : "not "}in focus.`,
      });
      return data.id;
    } else {
      await saveOnHoldDate(addDays(weekPlans[0].startDate, 7));
    }
  };

  return {
    weekPlan: !weekPlans ? undefined : weekPlans[0],
    createWeekPlan,
    confirmProjectSelection,
    makeProjectDecision,
    isLoading,
    error,
  };
};

export default useWeekPlan;
