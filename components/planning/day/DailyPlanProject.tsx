import { Project, useProjectsContext } from "@/api/ContextProjects";
import { DailyPlan, DailyPlanProject } from "@/api/useDailyPlans";
import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import AddTodoSection from "@/components/ui-elements/editors/todo-editor/AddTodoSection";
import { setPostponedTodoList, setTodoList } from "@/helpers/today";
import { flow, get, identity } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import ProjectAccordionItem from "../../projects/ProjectAccordionItem";
import DailyPlanProjectMenu from "./DailyPlanProjectMenu";
import DailyPlanProjectTodos from "./DailyPlanProjectTodos";

interface DailyPlanTodo {
  todoId: string;
  postPoned?: boolean;
  done?: boolean;
}

type DailyPlanProjectProps = {
  dayPlan: DailyPlan;
  dailyPlanProject: DailyPlanProject;
  mutateTodo: (todo: DailyPlanTodo, refresh: boolean) => void;
  mutateProject: (project: DailyPlanProject, refresh: boolean) => void;
};

const DailyPlanProjectComponent: FC<DailyPlanProjectProps> = ({
  dayPlan,
  dailyPlanProject,
  mutateTodo,
  mutateProject,
}) => {
  const { getProjectById } = useProjectsContext();
  const [project, setProject] = useState<Project | undefined>();
  const { projectTodos, createTodo, mutate } = useProjectTodos(project?.id);
  const [openTodos, setOpenTodos] = useState<ProjectTodo[] | undefined>();
  const [closedTodos, setClosedTodos] = useState<ProjectTodo[] | undefined>();
  const [postponedTodos, setPostponedTodos] = useState<
    ProjectTodo[] | undefined
  >();
  const [showTodos, setShowTodos] = useState(!dailyPlanProject.maybe);
  const [showDonePostPoned, setShowDonePostPoned] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);

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

  return (
    project && (
      <div className="space-y-2">
        <div className="sticky top-[8.75rem] md:top-[10.5rem] z-30 bg-bgTransparent">
          <ProjectAccordionItem project={project} />
        </div>

        <DailyPlanProjectMenu
          {...{
            dayPlan,
            dailyPlanProject,
            isTodoFormOpen,
            setIsTodoFormOpen,
            showDonePostPoned,
            showTodos,
            setShowDonePostPoned,
            setShowTodos,
            mutate: (maybe, refresh) =>
              mutateProject({ ...dailyPlanProject, maybe }, refresh),
          }}
        />

        <div className="space-y-2 ml-1 md:ml-2">
          {showTodos && (
            <>
              <AddTodoSection
                onSave={createTodo}
                formControl={{
                  open: isTodoFormOpen,
                  setOpen: setIsTodoFormOpen,
                }}
              />

              <DailyPlanProjectTodos
                dayPlanId={dayPlan.id}
                status="OPEN"
                todos={openTodos}
                mutate={(todo, refresh) =>
                  todo.done
                    ? openTodos &&
                      mutate(
                        openTodos.map((t) =>
                          t.todoId !== todo.todoId
                            ? t
                            : { ...t, done: todo.done! }
                        ),
                        refresh
                      )
                    : mutateTodo(todo, refresh)
                }
              />
            </>
          )}

          {showDonePostPoned && (
            <div className="text-muted-foreground">
              <DailyPlanProjectTodos
                dayPlanId={dayPlan.id}
                status="DONE"
                todos={closedTodos}
                mutate={mutateTodo}
              />

              <DailyPlanProjectTodos
                dayPlanId={dayPlan.id}
                status="POSTPONED"
                todos={postponedTodos}
                mutate={mutateTodo}
              />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default DailyPlanProjectComponent;
