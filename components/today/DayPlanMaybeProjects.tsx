import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { FC } from "react";
import DailyPlanMaybeProject from "../planning/day/DailyPlanMaybeProject";

interface DayPlanMaybeProjectsProps {
  dayPlan: DailyPlan;
  dayPlanProjects: DailyPlanProject[] | undefined;
  mutateProject: (project: DailyPlanProject, refresh: boolean) => void;
}

const DayPlanMaybeProjects: FC<DayPlanMaybeProjectsProps> = ({
  dayPlan,
  dayPlanProjects,
  mutateProject,
}) =>
  dayPlanProjects?.map((p) => (
    <DailyPlanMaybeProject
      key={p.recordId}
      {...{ dayPlan, dailyPlanProject: p, mutateProject }}
    />
  ));

export default DayPlanMaybeProjects;
