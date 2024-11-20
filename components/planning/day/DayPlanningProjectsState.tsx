import { Project } from "@/api/ContextProjects";
import { DailyPlan } from "@/api/useDailyPlans";
import { Accordion } from "@/components/ui/accordion";
import { isOnDayplan, setProjectOnDayPlanCount } from "@/helpers/planning";
import { filter, flow, identity, map } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import NextAction from "./NextAction";
import ProjectForDecision from "./ProjectForDecision";
import ShowProjectTodos from "./ShowProjectTodos";

type DayPlanningProjectsStateProps = {
  dayPlan: DailyPlan | undefined;
  projects: Project[] | undefined;
  onList?: boolean;
  nextAction?: string;
};

const DayPlanningProjectsState: FC<DayPlanningProjectsStateProps> = ({
  dayPlan,
  projects,
  nextAction,
  onList,
}) => {
  const [projectCount, setProjectCount] = useState(0);
  const [projectMaybeCount, setProjectMaybeCount] = useState(0);

  useEffect(() => {
    if (!dayPlan) return;
    if (!projects) return;
    setProjectOnDayPlanCount(
      dayPlan,
      !!onList,
      projects,
      false,
      setProjectCount
    );
    setProjectOnDayPlanCount(
      dayPlan,
      !!onList,
      projects,
      true,
      setProjectMaybeCount
    );
  }, [dayPlan, onList, projects]);

  return (
    !!dayPlan &&
    !!projects && (
      <>
        {nextAction && projects.length > 0 && (
          <NextAction
            action={`${nextAction}: ${projectCount}${projectMaybeCount === 0 ? "" : ` (listed as maybes: ${projectMaybeCount})`}`}
          />
        )}

        <Accordion type="single" collapsible className="space-y-8">
          {flow(
            identity<Project[]>,
            filter((p) => !onList || isOnDayplan(dayPlan, p, false)),
            map((project) => (
              <div key={project.id}>
                <ProjectForDecision project={project} dayPlan={dayPlan} />
                {!onList && (
                  <div className="ml-1 md:ml-2 mt-2">
                    <ShowProjectTodos projectId={project.id} />
                  </div>
                )}
              </div>
            ))
          )(projects)}

          {flow(
            identity<Project[]>,
            filter((p) => !!dayPlan && isOnDayplan(dayPlan, p, true)),
            map((project) => (
              <ProjectForDecision
                key={project.id}
                project={project}
                dayPlan={dayPlan}
              />
            ))
          )(projects)}
        </Accordion>
      </>
    )
  );
};

export default DayPlanningProjectsState;
