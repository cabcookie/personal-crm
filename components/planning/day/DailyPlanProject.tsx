import { Project, useProjectsContext } from "@/api/ContextProjects";
import useDailyPlans, {
  DailyPlan,
  DailyPlanProject,
} from "@/api/useDailyPlans";
import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import ShowHideSwitch from "@/components/ui-elements/ShowHideSwitch";
import { setPostponedTodoList, setTodoList } from "@/helpers/today";
import { flow, get, identity } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import ProjectAccordionItem from "../../projects/ProjectAccordionItem";
import DailyPlanProjectTodos from "./DailyPlanProjectTodos";
import ReviseProjectDecision from "./ReviseProjectDecision";

type DailyPlanProjectProps = {
  dayPlan: DailyPlan;
  dailyPlanProject: DailyPlanProject;
  className?: string;
};

const DailyPlanProjectComponent: FC<DailyPlanProjectProps> = ({
  dayPlan,
  dailyPlanProject,
}) => {
  const { addProjectToDayPlan, postponeTodo } = useDailyPlans("OPEN");
  const { getProjectById } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>();
  const { projectTodos, finishTodo } = useProjectTodos(project?.id);
  const [openTodos, setOpenTodos] = useState<ProjectTodo[] | undefined>();
  const [closedTodos, setClosedTodos] = useState<ProjectTodo[] | undefined>();
  const [postponedTodos, setPostponedTodos] = useState<
    ProjectTodo[] | undefined
  >();
  const [showTodos, setShowTodos] = useState(!dailyPlanProject.maybe);
  const [showDonePostPoned, setShowDonePostPoned] = useState(false);

  useEffect(() => {
    flow(
      identity<DailyPlanProject>,
      get("projectId"),
      getProjectById,
      setProject
    )(dailyPlanProject);
  }, [dailyPlanProject, getProjectById]);

  useEffect(() => {
    setTodoList(projectTodos, false, dayPlan, setOpenTodos);
    setTodoList(projectTodos, true, dayPlan, setClosedTodos);
    setPostponedTodoList(projectTodos, dayPlan, setPostponedTodos);
  }, [projectTodos, dayPlan]);

  const addProject = async (maybe: boolean) => {
    await addProjectToDayPlan(dayPlan.id, dailyPlanProject.projectId, maybe);
  };

  return (
    project && (
      <div className="space-y-2">
        <div className="sticky top-[8.75rem] md:top-[10.5rem] z-30 bg-bgTransparent">
          <ProjectAccordionItem project={project} />
        </div>

        <div className="space-y-2 ml-1 md:ml-2">
          <ReviseProjectDecision
            maybe={dailyPlanProject.maybe}
            onChange={addProject}
          />

          <ShowHideSwitch
            value={showTodos}
            onChange={setShowTodos}
            switchLabel="open todos"
          />

          {showTodos && (
            <>
              <DailyPlanProjectTodos
                status="OPEN"
                todos={openTodos}
                finishTodo={finishTodo}
                postponeTodo={(todoId) =>
                  postponeTodo(dayPlan.id, todoId, true)
                }
              />

              <ShowHideSwitch
                value={showDonePostPoned}
                onChange={setShowDonePostPoned}
                switchLabel="done & postponed"
              />

              {showDonePostPoned && (
                <div className="text-muted-foreground">
                  <DailyPlanProjectTodos
                    status="DONE"
                    todos={closedTodos}
                    finishTodo={finishTodo}
                  />

                  <DailyPlanProjectTodos
                    status="POSTPONED"
                    todos={postponedTodos}
                    finishTodo={finishTodo}
                    activateTodo={(todoId) =>
                      postponeTodo(dayPlan.id, todoId, false)
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  );
};

export default DailyPlanProjectComponent;
