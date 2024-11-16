import { Project } from "@/api/ContextProjects";
import { DailyPlan, DailyPlanTodo } from "@/api/useDailyPlans";
import useProjectTodos, { ProjectTodo } from "@/api/useProjectTodos";
import { filter, flow } from "lodash/fp";
import { FC, useEffect, useState } from "react";
import TodoForDecision from "../todos/TodoForDecision";

type ReviewProjectForDailyPlanningProps = {
  dailyPlan: DailyPlan;
  project: Project;
  updateOnHoldDate: (onHoldTill: Date | null) => void;
  putTodoOnDailyPlan: (todo: DailyPlanTodo) => void;
  className?: string;
};

const filterTodos = (
  projectTodos: ProjectTodo[] | undefined,
  dailyPlan: DailyPlan,
  setFilteredTodos: (val: ProjectTodo[] | undefined) => void
) =>
  flow(
    filter(
      (pt: ProjectTodo) =>
        !pt.done &&
        !pt.isOrphan &&
        !dailyPlan.todos.map((t) => t.todoId).includes(pt.todoId)
    ),
    setFilteredTodos
  )(projectTodos);

const ReviewProjectForDailyPlanning: FC<ReviewProjectForDailyPlanningProps> = ({
  dailyPlan,
  project,
  putTodoOnDailyPlan,
}) => {
  const { projectTodos } = useProjectTodos(project.id);
  const [filteredTodos, setFilteredTodos] = useState<
    ProjectTodo[] | undefined
  >();

  useEffect(() => {
    filterTodos(projectTodos, dailyPlan, setFilteredTodos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTodos, dailyPlan.todos]);

  return (
    <div className="space-y-2 mb-8">
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
                postPoned: false,
              })
            }
            activityId={t.activityId}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewProjectForDailyPlanning;
