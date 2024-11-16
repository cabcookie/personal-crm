import { useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import { Accordion } from "@/components/ui/accordion";
import { logFp } from "@/helpers/functional";
import { filterAndSortProjectsForDailyPlanning } from "@/helpers/planning";
import { addDays } from "date-fns";
import { flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import ProjectForDecision from "./ProjectForDecision";

type DayPlanningProjectsForDecisionProps = {
  addProjectToDayPlan: (projectId: string) => void;
  day: Date;
};

const DayPlanningProjectsForDecision: FC<
  DayPlanningProjectsForDecisionProps
> = ({ day }) => {
  const { projects, saveProjectDates } = useProjectsContext();
  const { accounts } = useAccountsContext();

  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState<
    Project[]
  >([]);

  useEffect(() => {
    flow(
      filterAndSortProjectsForDailyPlanning(accounts, day),
      logFp("filteredAndSortedProjects"),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projects, day]);

  return (
    <Accordion type="single" collapsible>
      {filteredAndSortedProjects.map((project) => (
        <ProjectForDecision
          key={project.id}
          project={project}
          pushProjectToNextDay={() =>
            saveProjectDates({
              projectId: project.id,
              onHoldTill: addDays(day, 1),
            })
          }
        />
      ))}
    </Accordion>
  );
};

export default DayPlanningProjectsForDecision;

/**
 * {dailyPlan && (
          <div className="space-y-12">
            {filteredAndSortedProjects.map((project) => (
              <ReviewProjectForDailyPlanning
                key={project.id}
                dailyPlan={dailyPlan}
                project={project}
                updateOnHoldDate={(onHoldTill) =>
                  saveProjectDates({ projectId: project.id, onHoldTill })
                }
                putTodoOnDailyPlan={(todo: DailyPlanTodo) =>
                  addTodoToDailyPlan(dailyPlan.id, todo)
                }
                className="bg-bgTransparent sticky top-[9.5rem] md:top-[10.5rem] z-30 pb-1"
              />
            ))}
          </div>
        )}
 */
