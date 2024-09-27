import { Project } from "@/api/ContextProjects";
import useDailyPlans, { DailyPlanTodo } from "@/api/useDailyPlans";
import { cn } from "@/lib/utils";
import {
  compact,
  filter,
  flow,
  get,
  identity,
  includes,
  map,
  size,
  sortBy,
} from "lodash/fp";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";
import PostPonedTodo from "./PostPonedTodo";
import ProjectInformation from "./ProjectInformation";
import TodoForDecision from "./TodoForDecision";

type DailyPlanProjectProps = {
  projects: Project[] | undefined;
  todos: DailyPlanTodo[];
  className?: string;
};

const DailyPlanProject: FC<DailyPlanProjectProps> = ({
  projects,
  todos,
  className,
}) => {
  const { updateTodoStatus, postponeTodo } = useDailyPlans("OPEN");

  return size(todos) === 0 ? (
    <div className="mx-2 md:mx-4 my-8 font-semibold text-sm text-muted-foreground md:text-center">
      No open todos.
    </div>
  ) : (
    map((project: Project) => (
      <div className={cn(className)} key={project.id}>
        <div className="font-semibold">
          {project.project}
          <Link className="ml-1" href={`/projects/${project.id}`}>
            <ExternalLink className="-translate-y-0.5 w-5 h-5 text-muted-foreground hover:text-primary inline-block" />
          </Link>
        </div>
        <ProjectInformation project={project} />
        {flow(
          identity<DailyPlanTodo[]>,
          filter(flow(get("projectIds"), includes(project.id))),
          compact,
          sortBy((t) => (t?.postPoned ? 2 : t?.done ? 1 : 0)),
          map(
            ({
              todo: { content },
              todoId,
              activityId,
              done,
              postPoned,
              recordId,
            }) =>
              !postPoned ? (
                <TodoForDecision
                  key={todoId}
                  activityId={activityId}
                  content={content}
                  todoStatus={done}
                  finishTodoOnDailyPlan={() => updateTodoStatus(todoId, !done)}
                >
                  {!done && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => postponeTodo(recordId, true)}
                    >
                      Not today
                    </Button>
                  )}
                </TodoForDecision>
              ) : (
                <PostPonedTodo
                  key={todoId}
                  done={done}
                  content={content}
                  postponeTodo={() => postponeTodo(recordId, false)}
                />
              )
          )
        )(todos)}
      </div>
    ))(projects)
  );
};

export default DailyPlanProject;
