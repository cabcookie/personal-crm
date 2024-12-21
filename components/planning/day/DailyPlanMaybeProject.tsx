import { Project, useProjectsContext } from "@/api/ContextProjects";
import { addProjectDayplan } from "@/api/dayplan/add-project-dayplan";
import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import { ButtonPlayPause } from "@/components/ui/button-play-pause";
import { IconButton } from "@/components/ui/icon-button";
import { flow, get, identity } from "lodash/fp";
import { ExternalLink } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface DailyPlanMaybeProjectProps {
  dayPlan: DailyPlan;
  dailyPlanProject: DailyPlanProject;
  mutateProject: (project: DailyPlanProject, refresh: boolean) => void;
}

const DailyPlanMaybeProject: FC<DailyPlanMaybeProjectProps> = ({
  dayPlan,
  dailyPlanProject,
  mutateProject,
}) => {
  const { getProjectById } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    flow(
      identity<DailyPlanProject>,
      get("projectId"),
      getProjectById,
      setProject
    )(dailyPlanProject);
  }, [dailyPlanProject, getProjectById]);

  const addProject = (maybe: boolean) =>
    addProjectDayplan({
      data: {
        dayPlanId: dayPlan.id,
        projectId: dailyPlanProject.projectId,
        maybe,
      },
      options: {
        mutate: (refresh) =>
          mutateProject({ ...dailyPlanProject, maybe }, refresh),
      },
    });

  return (
    project && (
      <div className="space-y-2">
        <div className="font-semibold">{project.project}</div>
        <div className="flex flex-wrap gap-1">
          <ButtonPlayPause
            state={dailyPlanProject.maybe ? "PAUSE" : "PLAY"}
            className="h-7 p-1"
            onClick={() => addProject(!dailyPlanProject.maybe)}
          />

          <IconButton
            tooltip="Details"
            label="Details"
            className="w-24 h-7 p-1"
            onClick={() => window.open(`/projects/${project.id}`, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    )
  );
};

export default DailyPlanMaybeProject;
