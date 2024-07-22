import { Account, useAccountsContext } from "@/api/ContextAccounts";
import { Project, useProjectsContext } from "@/api/ContextProjects";
import useWeekPlan, { WeeklyPlan } from "@/api/useWeekPlan";
import MainLayout from "@/components/layouts/MainLayout";
import ContextSwitcher from "@/components/navigation-menu/ContextSwitcher";
import MakeProjectDecision from "@/components/planning/MakeProjectDecision";
import ButtonGroup from "@/components/ui-elements/btn-group/btn-group";
import DateSelector from "@/components/ui-elements/selectors/date-selector";
import { Accordion } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateProjectOrder } from "@/helpers/projects";
import { addDays, differenceInCalendarDays } from "date-fns";
import { filter, flow, map, sortBy } from "lodash/fp";
import { CalendarCheck, FileWarning, Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";

const projectFilters = ["Open", "In Focus", "On Hold"] as const;
type ProjectFilters = (typeof projectFilters)[number];

const filterAndSortProjects = (
  accounts: Account[] | undefined,
  startDate: Date,
  weekPlan: WeeklyPlan | undefined,
  projectFilter: ProjectFilters
) =>
  flow(
    filter((p: Project) => !p.done),
    filter((p): boolean =>
      projectFilter === "Open"
        ? !weekPlan?.projectIds.includes(p.id) &&
          (!p.onHoldTill ||
            differenceInCalendarDays(p.onHoldTill, startDate) < 7)
        : projectFilter === "On Hold"
        ? !weekPlan?.projectIds.includes(p.id) &&
          !!p.onHoldTill &&
          differenceInCalendarDays(p.onHoldTill, startDate) >= 7
        : !!weekPlan?.projectIds.includes(p.id) &&
          (!p.onHoldTill ||
            differenceInCalendarDays(p.onHoldTill, startDate) < 7)
    ),
    map(updateProjectOrder(accounts)),
    sortBy((p) => -p.order)
  );

const WeeklyPlanningPage = () => {
  const {
    weekPlan,
    createWeekPlan,
    isLoading,
    error,
    confirmProjectSelection,
  } = useWeekPlan();
  const [startDate, setStartDate] = useState(
    weekPlan?.startDate || addDays(new Date(), 1)
  );
  const { projects, saveProjectDates } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [projectFilter, setProjectFilter] = useState<ProjectFilters>("Open");
  const [filteredAndSortedProjects, setFilteredAndSortedProjects] = useState(
    filterAndSortProjects(
      accounts,
      startDate,
      weekPlan,
      projectFilter
    )(projects)
  );

  useEffect(() => {
    flow(
      filterAndSortProjects(accounts, startDate, weekPlan, projectFilter),
      setFilteredAndSortedProjects
    )(projects);
  }, [accounts, projectFilter, projects, startDate, weekPlan]);

  useEffect(() => {
    if (!weekPlan) return;
    setStartDate(weekPlan.startDate);
  }, [weekPlan]);

  return (
    <MainLayout title="Weekly Planning" sectionName="Weekly Planning">
      {error && (
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Loading Week Plan Failed</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="week-start-date" className="font-semibold">
            Start date of the week
          </Label>
          <DateSelector
            disabled={!!weekPlan}
            elementId="week-start-date"
            date={startDate}
            setDate={setStartDate}
          />
          {isLoading ? (
            <Loader2 className="mt-2 ml-2 h-6 w-6 animate-spin" />
          ) : weekPlan ? (
            <Button
              onClick={confirmProjectSelection}
              disabled={
                filterAndSortProjects(
                  accounts,
                  startDate,
                  weekPlan,
                  "Open"
                )(projects).length > 0
              }
            >
              <div className="flex flex-row gap-2 items-center">
                <CalendarCheck className="w-4 h-4" /> Confirm Project Selection
              </div>
            </Button>
          ) : (
            <Button onClick={() => createWeekPlan(startDate)}>
              <div className="flex flex-row gap-2 items-center">
                <Play className="w-4 h-4" /> Start Week Planning
              </div>
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <ContextSwitcher />
        </div>

        <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
          {!weekPlan ? (
            "Start Week Planning to review a list of projects for the current context."
          ) : (
            <div>
              <div>
                Review each project and decide if you can make progress here
                during the next week.
              </div>
              <div>
                Projects to be reviewed:{" "}
                {
                  filterAndSortProjects(
                    accounts,
                    startDate,
                    weekPlan,
                    "Open"
                  )(projects).length
                }
              </div>
              <div>
                Projects on hold:{" "}
                {
                  filterAndSortProjects(
                    accounts,
                    startDate,
                    weekPlan,
                    "On Hold"
                  )(projects).length
                }
              </div>
              <div>
                Projects in focus:{" "}
                {
                  filterAndSortProjects(
                    accounts,
                    startDate,
                    weekPlan,
                    "In Focus"
                  )(projects).length
                }
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-filter" className="mx-2 font-semibold">
            Filter projects
          </Label>
          <ButtonGroup
            elementId="project-filter"
            values={["Open", "In Focus", "On Hold"]}
            selectedValue={projectFilter}
            onSelect={(val: string) =>
              projectFilters.includes(val as ProjectFilters) &&
              setProjectFilter(val as ProjectFilters)
            }
          />
        </div>

        {weekPlan && (
          <Accordion type="single" collapsible>
            {filteredAndSortedProjects.map((project) => (
              <MakeProjectDecision
                startDate={startDate}
                key={project.id}
                isInFocus={weekPlan.projectIds.some((id) => id === project.id)}
                project={project}
                saveOnHoldDate={(onHoldTill) =>
                  saveProjectDates({ projectId: project.id, onHoldTill })
                }
              />
            ))}
          </Accordion>
        )}
      </div>
    </MainLayout>
  );
};

export default WeeklyPlanningPage;
