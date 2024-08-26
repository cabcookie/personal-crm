import { Project } from "@/api/ContextProjects";
import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import { DailyPlan, DailyPlanTodo } from "@/pages/api/useDailyPlans";
import { addDays } from "date-fns";
import { filter, flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import DecisionButton from "./DecisionButton";
import ProjectBadges from "./ProjectBadges";
import ProjectInformation from "./ProjectInformation";
import ProjectTitleAndLink from "./ProjectTitleAndLink";
import TodoForDecision from "./TodoForDecision";

type ReviewProjectForDailyPlanningProps = {
  dailyPlan: DailyPlan;
  project: Project;
  updateOnHoldDate: (onHoldTill: Date | null) => void;
  putTodoOnDailyPlan: (todo: DailyPlanTodo) => void;
};

const filterTodos = (
  projectTodos: ProjectTodo[] | undefined,
  dailyPlan: DailyPlan,
  setFilteredTodos: (val: ProjectTodo[] | undefined) => void
) =>
  flow(
    filter(
      (pt: ProjectTodo) =>
        !pt.done && !dailyPlan.todos.map((t) => t.todoId).includes(pt.todoId)
    ),
    setFilteredTodos
  )(projectTodos);

const ReviewProjectForDailyPlanning: FC<ReviewProjectForDailyPlanningProps> = ({
  dailyPlan,
  project,
  updateOnHoldDate,
  putTodoOnDailyPlan,
}) => {
  const { projectTodos } = useProjectTodos(project.id);
  const [filteredTodos, setFilteredTodos] = useState<
    ProjectTodo[] | undefined
  >();
  const [pushingProject, setPushingProject] = useState(false);

  useEffect(() => {
    console.log("useEffect", { projectTodos, dailyPlan });
    filterTodos(projectTodos, dailyPlan, setFilteredTodos);
  }, [projectTodos, dailyPlan.todos]);

  const pushProject = () => {
    setPushingProject(true);
    updateOnHoldDate(addDays(dailyPlan.day, 1));
  };

  return (
    <div className="space-y-2 mb-8">
      <ProjectTitleAndLink
        projectId={project.id}
        projectName={project.project}
      />

      <ProjectBadges
        {...project}
        hasOpenTodos={projectTodos && projectTodos.length > 0}
      />

      <ProjectInformation project={project} />

      <div className="space-y-1 pb-4">
        {filteredTodos?.map((t) => (
          <TodoForDecision
            key={t.todoId}
            content={t.todo.content}
            putTodoOnDailyPlan={() =>
              putTodoOnDailyPlan({
                recordId: crypto.randomUUID(),
                done: t.done,
                projectIds: [],
                todo: t.todo,
                todoId: t.todoId,
                activityId: t.activityId,
              })
            }
            activityId={t.activityId}
          />
        ))}
      </div>

      <DecisionButton
        label="Push project to next day"
        selected={false}
        isLoading={pushingProject}
        makeDecision={pushProject}
      />
    </div>
  );
};

export default ReviewProjectForDailyPlanning;
